import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../common/errors/appError.js";
import { prisma } from "../../common/prisma.js";
import type { changePasswordDto, loginDto, signUpDto } from "./auth.schema.js";
import { ENV } from "../../config/env.js";
import { createOrganization } from "../organization/organization.service.js";
import { UserRole } from "../../common/types/enums.types.js";

export const signupUser = async (data: signUpDto) => {
  // Check if user email exists
  const existingEmail = await prisma.staff.findFirst({
    where: { OR: [{ email: data.user.email }, { phone: data.user.phone }] },
  });

  if (existingEmail) {
    throw new AppError("User Email or Phone already exists!", 409);
  }

  // Create Organization
  const organization = await createOrganization(data.organization);

  // Create the user
  const hashedPassword = await bcrypt.hash(data.user.password, ENV.BCRYPT_SALT);
  const user = await prisma.staff.create({
    data: {
      ...data.user,
      password: hashedPassword,
      orgId: organization.id,
      role: UserRole.OWNER,
    },
  });

  const token = await generateJwtToken(user.id, user.role, organization.id);
  const res = { token, user, organization };
  return res;
};

const generateJwtToken = async (id: string, role: string, orgId: string) => {
  const token = await jwt.sign(
    {
      id,
      role,
      orgId,
    },
    ENV.JWT_SECRET,
    {
      expiresIn: "24h",
    },
  );
  return token;
};

export const login = async (data: loginDto) => {
  const user = await prisma.staff.findUnique({
    where: {
      email: data.email,
    },
    include: { organization: true },
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = await generateJwtToken(user.id, user.role, user.orgId);

  const res = {
    token,
    user,
  };

  return res;
};

export const changePassword = async (
  userId: string,
  data: changePasswordDto,
) => {
  const user = await prisma.staff.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("Staff not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid old password", 401);
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, ENV.BCRYPT_SALT);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};
