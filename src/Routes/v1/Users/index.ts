import UserController from "@/Controller/User";
import { Routes } from "@/Interfaces/router";
import UserValidations from "@/Validators/User";
import { Router } from "express";
import { Inject, Service } from "typedi";

@Service()
class UserRouter implements Routes {
  constructor (
    @Inject() private readonly userController: UserController,
    @Inject() private readonly userValidator: UserValidations,
  ) {
    this.path = "/users";
    this.router = Router();

    this.initializeRoutes()
  }

  public path: string;
  public router: Router;

  private initializeRoutes () {
    this.router.get('/google', this.userController.getGoogleUrl);
    this.router.post('/google', this.userController.googleAuth);
    this.router.post('/', this.userValidator.signupValidator, this.userController.signup);
    this.router.post('/login', this.userValidator.loginValidator, this.userController.login);
    this.router.post('/password', this.userValidator.fogotPasswordValidator, this.userController.forgotPassword)
    this.router.post('/password/reset', this.userValidator.resetPasswordValidator, this.userController.resetPassword);
    this.router.post('/email', this.userValidator.emailVerificationValidator, this.userController.verifyEmail);
  }
}

export default UserRouter;
