import { Request, Response, NextFunction } from "express";

export const jsonResponseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (!res.locals.results)
  //   throw new Error("Error! No data to include in response");
  res.setHeader("Content-Type", "application/json");
  res.json({ data: res.locals.results, ok: true });
  res.end();
  next();
};
