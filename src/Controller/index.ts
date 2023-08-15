import { logger } from "@/Logger";
import { serverError } from "@/Utils/api_response";
import { Response } from "express";

class BaseController {
  public catchError = (error: any, res: Response) => {
    logger.error(error);
    return serverError(res);
  }
}

export default BaseController;
