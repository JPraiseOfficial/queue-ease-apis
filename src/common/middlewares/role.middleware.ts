import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError.js";
import type { UserRoleType } from "../types/enums.types.js";

export const authorize = (allowedRoles: UserRoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }

    next();
  };
};
