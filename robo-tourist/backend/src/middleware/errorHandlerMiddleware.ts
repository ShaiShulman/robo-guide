import { Request, Response, NextFunction } from "express";
import { TEXT_COLOR } from "../const";

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(TEXT_COLOR.red, err.stack, TEXT_COLOR.black);
  res.status(500).json({
    error: {
      message: err.message,
      stack: err.stack,
    },
  });
};
