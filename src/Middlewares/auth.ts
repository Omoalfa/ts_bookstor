import { unAthorized } from "@/Utils/api_response";
import { decodeToken } from "@/Utils/jwt";
import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";

@Service()
class AuthMiddleware {
  public isAuth = (req: Request, res: Response, next: NextFunction) => {
    const autorization = req.headers["authorization"];

    if (!autorization?.startsWith("Bearer")) {
      return unAthorized(res, null, "Invalid token");
    } else {
      try {
        const token = autorization.split(" ")[1];

        const { id, email } = decodeToken(token)

        // ideally we want to add the id and remail to the req object like so
        // req.user_id = id
        // req.user_email = email

        return next();
      } catch (error) {
        return unAthorized(res, null, "Invalid token")
      }
    }
  }
}

export default AuthMiddleware;
