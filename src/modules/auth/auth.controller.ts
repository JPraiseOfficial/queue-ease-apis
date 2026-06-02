import type { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service.js";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.signupUser(req.body);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token: user.token,
      user: user.user,
      organization: user.organization
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await authService.login(req.body);

    res.status(200).json({
      status: "success",
      message: "User Logged in successfully",
      token: data.token,
      user: data.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await authService.changePassword(req.user?.id!, req.body);

    res.status(200).json({
      status: "success",
      message: data.message,
    });
  } catch (error) {
    next(error);
  }
};
