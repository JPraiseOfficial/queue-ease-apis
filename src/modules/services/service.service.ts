import { prisma } from "../../common/prisma.js";
import { AppError } from "../../common/errors/appError.js";
import type { CreateServiceDto, UpdateServiceDto } from "./service.schema.js";
import { removeUndefined } from "../../common/utils/utils.js";

export const createService = async (orgId: string, data: CreateServiceDto) => {
  const existingServiceCode = await prisma.service.findFirst({
    where: { AND: [{ code: data.code }, { orgId }] },
  });

  if (existingServiceCode) {
    throw new AppError("Service with this code already exists", 409);
  }
  
  const service = await prisma.service.create({
    data: {
      ...data,
      orgId,
    },
  });
  return service;
};

export const getService = async (id: string, orgId: string) => {
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) throw new AppError("Service not found", 404);
  if (service.orgId !== orgId) throw new AppError("Unauthorized access", 403);

  return service;
};

export const getAllServices = async (orgId: string) => {
  const services = await prisma.service.findMany({ where: { orgId } });
  return services;
};

export const updateService = async (
  id: string,
  orgId: string,
  data: UpdateServiceDto,
) => {
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) throw new AppError("Service not found", 404);
  if (service.orgId !== orgId) throw new AppError("Unauthorized access", 403);

  const cleanData = removeUndefined(data)

  const updatedService = await prisma.service.update({
    where: { id },
    data: { ...cleanData },
  });
  return updatedService;
};

export const deleteService = async (id: string, orgId: string) => {
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) throw new AppError("Service not found", 404);
  if (service.orgId !== orgId) throw new AppError("Unauthorized access", 403);

  await prisma.service.delete({ where: { id } });
};
