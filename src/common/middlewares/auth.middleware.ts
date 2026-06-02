import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/appError.js";
import { ENV } from "../../config/env.js";
import type { AuthTokenPayload } from "../types/jwt.type.js";

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("You are not logged in!", 401));
    }

    const token = authHeader.split(" ")[1]!;

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthTokenPayload;

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token. Please log in again.", 401));
  }
};
