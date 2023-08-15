// import knex from "@Database/index";
import UserAdapter from "@/Database/adapters/UserAdapter";
import { sendMail } from "@/Utils/mailer";
import { created, serverError, success, successAction } from "@Utils/api_response";
import { Request, Response } from "express";
import { Service } from "typedi";
import { generateToken } from "@/Utils/jwt";
import BaseController from "..";
import { generateAuthUrl, getUserProfile, passwordLinkGenerator, pinGenerator } from "@/Utils/helper"
import * as bcrypt from 'bcrypt';

@Service()
class UserController extends BaseController {
  constructor (
    private readonly userAdapter: UserAdapter
  ) {
    super()
  }

  public login = async (req: Request, res: Response) => {
    const { email } = req.body as { email: string, password: string }

    try {
      const user = await this.userAdapter.DBGetUserAndPassword(email);

      const token = generateToken({ email, id: user.id });

      return success(res, { token }, "Logged in successfully");
    } catch (error) {
      return this.catchError(error, res)
    }
  }

  public signup = async (req: Request, res: Response) => {
    const { email, first_name, last_name, password: raw } = req.body;

    try {
      const password = bcrypt.hashSync(raw, 10);
      const verification_code = pinGenerator(4);

      const user = this.userAdapter.DBCreateUser({
        email, first_name, last_name, password, verification_code
      })

      const mailContent = `
        <p>Hi, use this code to activate your account</p>
        <h2>${verification_code}</h2>
      `

      sendMail({
        to: email,
        type: 'html',
        content: mailContent,
        subject: 'Please verify you email',
        from: 'Your Bookstore'
      })

      return created(res, user, "Account created successfully");
    } catch (error) {
      return this.catchError(error, res)
    }
  }

  public verifyEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
      await this.userAdapter.DBUpdateUser(email, { is_verified: true, verification_code: null })

      return successAction(res);
    } catch (error) {
      return this.catchError(error, res)
    }
  }

  public forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
      const password_otp = pinGenerator(6);

      await this.userAdapter.DBUpdateUser(email, { password_otp, updated_at: new Date() });

      const resetPasswordLink = passwordLinkGenerator(password_otp, email);

      const mailContent = `
        <p>Hello, please follow this <a href="${resetPasswordLink}">link</a> to reset your password.<br /> or <br /> copy this link to your browser and reset your password: ${resetPasswordLink}
      `;

      await sendMail({
        to: email,
        type: 'html',
        content: mailContent,
        subject: 'Your password recovery link!',
        from: 'Your Bookstore'
      })   
      
      return successAction(res);
    } catch (error) {
      return this.catchError(error, res)
    }
  }

  public resetPassword = async (req: Request, res: Response) => {
    const { password: raw } = req.body;
    const { email } = req.query as { email: string };

    try {
      const password = bcrypt.hashSync(raw, 10);

      await this.userAdapter.DBUpdateUser(email, { password, password_otp: null });

      return successAction(res);
    } catch (error) {
      return this.catchError(error, res)
    }
  }

  public getGoogleUrl = async (req: Request, res: Response) => {
    try {
      const auth_url = generateAuthUrl()

      return success(res, { auth_url }, "Authentication url generated")
    } catch (error) {
      return this.catchError(error, res)
    }
  }

  public googleAuth = async (req: Request, res: Response) => {
    const { code } = req.query as { code: string };

    try {
      const user = await getUserProfile(code);

      const exist = await this.userAdapter.DBGetUserAndPassword(user.email);

      if (exist) {
        const token = generateToken({ email: exist.email, id: exist.id });

        return success(res, { token }, "Logged in successfully")
      } else {
        const profile = await this.userAdapter.DBCreateUser({ ...user, is_verified: true });

        const token = generateToken({ email: profile.email, id: profile.id })

        return created(res, { token }, "Logged in successfully")
      }
    } catch (error) {
      return this.catchError(error, res)
    }
  }
}

export default UserController;
