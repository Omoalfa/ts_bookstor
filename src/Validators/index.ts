import { NextFunction, Request, Response } from 'express';
import { Schema, checkSchema, validationResult } from 'express-validator';

class Validator {
  public validate = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(checkSchema(schema).map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({
      status: 400,
      errors: errors.array(),
    });
  };
}

export default Validator;
