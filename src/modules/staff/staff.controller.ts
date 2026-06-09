import type { NextFunction, Request, Response } from "express";
import * as staffService from "./staff.service.js";

export const createStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staff = await staffService.createStaff(req.user?.orgId!, req.body);
    res.status(201).json({
      status: "success",
      message: "Staff created successfully",
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staffs = await staffService.getAllStaff(req.user?.orgId!);
    res.status(200).json({
      status: "success",
      data: staffs,
    });
  } catch (error) {
    next(error);
  }
};

export const getStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staff = await staffService.getStaff(
      req.params.id as string,
      req.user?.orgId!,
    );
    res.status(200).json({
      status: "success",
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staff = await staffService.updateStaff(
      req.params.id as string,
      req.user!,
      req.body,
    );
    res.status(200).json({
      status: "success",
      message: "Staff updated successfully",
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

export const editProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await staffService.updateStaff(
      req.user!.id,
      req.user!,
      req.body,
    );
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const staff = await staffService.changeRole(
      req.params.id as string,
      req.user!,
      req.body,
    );
    res.status(200).json({
      status: "success",
      message: "Staff role updated successfully",
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await staffService.deleteStaff(req.params.id as string, req.user!);
    res.status(200).json({
      status: "success",
      message: "Staff deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const viewProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await staffService.viewProfile(req.user?.id!);
    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
