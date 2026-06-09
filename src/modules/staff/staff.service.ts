import bcrypt from "bcryptjs";
import { prisma } from "../../common/prisma.js";
import { AppError } from "../../common/errors/appError.js";
import type {
  CreateStaffDto,
  UpdateStaffDto,
  ChangeRoleDto,
} from "./staff.schema.js";
import { UserRole, type UserRoleType } from "../../common/types/enums.types.js";
import { ENV } from "../../config/env.js";
import { removeUndefined } from "../../common/utils/utils.js";

export const createStaff = async (orgId: string, data: CreateStaffDto) => {
  const existingStaff = await prisma.staff.findFirst({
    where: { OR: [{ email: data.email }, { phone: data.phone }] },
  });

  if (existingStaff) {
    throw new AppError("Staff Email or Phone already exists", 409);
  }

  // Check if service belongs to organization
  const serviceExists = await prisma.service.findUnique({
    where: { id: data.serviceId },
  });

  if (!serviceExists || serviceExists.orgId !== orgId) {
    throw new AppError("Service not found for organization!", 404);
  }

  const hashedPassword = await bcrypt.hash(data.password, ENV.BCRYPT_SALT);

  const staff = await prisma.staff.create({
    data: {
      ...data,
      password: hashedPassword,
      orgId,
      role: data.role || UserRole.STAFF,
    },
  });

  const { password, ...staffWithoutPassword } = staff;
  return staffWithoutPassword;
};

export const getAllStaff = async (orgId: string) => {
  const staffs = await prisma.staff.findMany({
    where: { orgId },
    include: { service: true },
  });

  return staffs.map((staff) => {
    const { password, ...staffWithoutPassword } = staff;
    return staffWithoutPassword;
  });
};

export const getStaff = async (id: string, orgId: string) => {
  const staff = await prisma.staff.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!staff) throw new AppError("Staff not found", 404);
  if (staff.orgId !== orgId) throw new AppError("Unauthorized access", 403);

  const { password, ...staffWithoutPassword } = staff;
  return staffWithoutPassword;
};

export const updateStaff = async (
  id: string,
  user: { id: string; role: UserRoleType; orgId: string },
  data: UpdateStaffDto,
) => {
  const targetStaff = await prisma.staff.findUnique({ where: { id } });

  if (!targetStaff) throw new AppError("Staff not found", 404);
  if (targetStaff.orgId !== user.orgId)
    throw new AppError("Unauthorized access", 403);

  // Admin edit restrictions
  if (
    user.role === "admin" &&
    user.id !== targetStaff.id &&
    targetStaff.role !== UserRole.STAFF
  ) {
    throw new AppError(
      "Admin cannot edit profile of another Admin or Owner",
      403,
    );
  }
  const cleanData = removeUndefined(data);
  const updatedStaff = await prisma.staff.update({
    where: { id },
    data: { ...cleanData },
  });

  const { password, ...staffWithoutPassword } = updatedStaff;
  return staffWithoutPassword;
};

export const changeRole = async (
  id: string,
  user: { id: string; role: UserRoleType; orgId: string },
  data: ChangeRoleDto,
) => {
  const targetStaff = await prisma.staff.findUnique({ where: { id } });

  if (!targetStaff) throw new AppError("Staff not found", 404);
  if (targetStaff.orgId !== user.orgId)
    throw new AppError("Unauthorized access", 403);

  // Admin cannot change owner's role
  if (user.role === "admin" && targetStaff.role !== "staff") {
    throw new AppError("Admin cannot change owner's role", 403);
  }

  const updatedStaff = await prisma.staff.update({
    where: { id },
    data: { role: data.role },
  });

  const { password, ...staffWithoutPassword } = updatedStaff;
  return staffWithoutPassword;
};

export const deleteStaff = async (
  id: string,
  user: { id: string; role: string; orgId: string },
) => {
  const targetStaff = await prisma.staff.findUnique({ where: { id } });

  if (!targetStaff) throw new AppError("Staff not found", 404);
  if (targetStaff.orgId !== user.orgId)
    throw new AppError("Unauthorized access", 403);

  // Admin delete restrictions
  if (user.role === "admin" && targetStaff.role !== UserRole.STAFF) {
    throw new AppError("Admin cannot delete another Admin or Owner", 403);
  }

  await prisma.staff.delete({ where: { id } });
};

export const viewProfile = async (id: string) => {
  const staff = await prisma.staff.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!staff) throw new AppError("Staff not found", 404);

  const { password, ...staffWithoutPassword } = staff;
  return staffWithoutPassword;
};
