import type { Request, Response, NextFunction } from "express";
import { ENV } from "../../config/env.js";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status: status,
    message: err.isOperational
      ? err.message
      : "Internal Server Error. Something went wrong!",
  });
};
