import { Request, Response, NextFunction } from "express";

const TEXT_RED = "\x1b[31m";
const TEXT_BLACK = "\x1b[30m";

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(TEXT_RED, err.stack, TEXT_BLACK);
  res.status(500).json({
    error: {
      message: err.message,
      stack: err.stack,
    },
  });
};
