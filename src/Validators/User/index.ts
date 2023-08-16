import { Service } from "typedi";
import Validator from "..";
import { UserValidatorAdapter } from "@/Database/adapters/UserAdapter";
import * as bcrypt from "bcrypt";
import { diff_minutes, validateCode } from "@/Utils/helper";

@Service()
class UserValidations extends Validator {
  constructor (
    private readonly userAdapter: UserValidatorAdapter
  ) {
    super()
  }

  public loginValidator = this.validate({
    email: {
      in: ["body"],
      isEmail: true,
    },
    password: {
      in: ["body"],
      isString: true,
      isLength: { options: { min: 8 }},
      custom: {
        options: async (password, { req }) => {
          try {
            const user = await this.userAdapter.DBGetUserAndPassword(req.body.email);

            console.log(user);
            if (!user || !bcrypt.compareSync(password, user.password)) {
              throw new Error("Invalid credentials!")
            }
          } catch (error) {
            throw new Error("Invalid credentials")
          }
        }
      }
    }
  })

  public signupValidator = this.validate({
    email: {
      in: ["body"],
      isEmail: true,
      custom: {
        options: async (email) => {
          const user = await this.userAdapter.DBCheckSignupEmail(email);

          if (user) throw new Error("Email already in use!")
        }
      }
    },
    password: {
      in: ["body"],
      isString: true,
      isLength: { options: { min: 8 }},
    },
    name: {
      in: ["body"],
      isString: true,
      notEmpty: true,
    }
  })

  public fogotPasswordValidator = this.validate({
    email: {
      in: ["body"],
      isEmail: true,
      custom: {
        options: async (email) => {
          const user = await this.userAdapter.DBCheckSignupEmail(email);

          if (!user) throw new Error("User does not exist!")
        }
      }
    },
  })

  public emailVerificationValidator = this.validate({
    email: {
      in: ["body"],
      isEmail: true
    },
    code: {
      in: ["body"],
      isString: true,
      isNumeric: true,
      isLength: { options: { min: 4, max: 4 }},
      custom: {
        options: async (code, { req }) => {
          const valid = await this.userAdapter.DBValidaterEmailVerificationCode(req.body.email, code);

          if (!valid) throw new Error("Invalid otp!")

          const now = new Date();
          const updateDate = new Date(valid.updated_at);

          if (diff_minutes(now, updateDate) > 15) throw new Error("Otp expired!")
        }
      }
    }
  })

  public resetPasswordValidator = this.validate({
    pin: {
      in: ["query"],
      isString: true,
      isNumeric: true,
      isLength: { options: { min: 4, max: 4 }},
      custom: {
        options: async (pin: string, { req }) => {
          const valid = await this.userAdapter.DBValidaterPasswordResetPin(req.query.email, pin);

          if (!valid) throw new Error("Invalid password reset url!")

          const now = new Date();
          const updateDate = new Date(valid.updated_at);

          if (diff_minutes(updateDate, now) > 15) throw new Error("Link expired!")
        }
      }
    },
    password: {
      in: ["body"],
      isString: true,
      isLength: { options: { min: 8 }},
    }
  })
}

export default UserValidations;
