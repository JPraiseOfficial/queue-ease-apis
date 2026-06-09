import type { NextFunction, Request, Response } from "express";
import * as serviceService from "./service.service.js";

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const service = await serviceService.createService(
      req.user?.orgId!,
      req.body,
    );
    res.status(201).json({
      status: "success",
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const getService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const service = await serviceService.getService(
      req.params.id as string,
      req.user?.orgId!,
    );
    res.status(200).json({
      status: "success",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const services = await serviceService.getAllServices(req.user?.orgId!);
    res.status(200).json({
      status: "success",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const service = await serviceService.updateService(
      req.params.id as string,
      req.user?.orgId!,
      req.body,
    );
    res.status(200).json({
      status: "success",
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await serviceService.deleteService(
      req.params.id as string,
      req.user?.orgId!,
    );
    res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
