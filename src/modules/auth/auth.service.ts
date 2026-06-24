import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../common/errors/appError.js";
import { prisma } from "../../common/prisma.js";
import type { changePasswordDto, loginDto, signUpDto } from "./auth.schema.js";
import { ENV } from "../../config/env.js";
import { UserRole, type UserRoleType } from "../../common/types/enums.types.js";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../common/utils/email.service.js";


export const signupUser = async (data: signUpDto) => {
  // Check if user email or phone exists
  const existingUser = await prisma.staff.findFirst({
    where: { email: data.user.email },
  });

  if (existingUser) {
    throw new AppError("User Email or Phone already exists!", 409);
  }

  const existingOrgName = await prisma.organization.findFirst({
    where: { name: data.organization.name },
  });
  if (existingOrgName) {
    throw new AppError("Organization with this name already exists!", 409);
  }

  const existingOrgCode = await prisma.organization.findFirst({
    where: { orgCode: data.organization.orgCode },
  });
  if (existingOrgCode) {
    throw new AppError("Organization with this code already exists!", 409);
  }

  // Using transaction so if one fails, everything rolls back safely
  const result = await prisma.$transaction(async (tx) => {
    const hashedPassword = await bcrypt.hash(
      data.user.password,
      ENV.BCRYPT_SALT,
    );

    const organization = await tx.organization.create({
      data: { ...data.organization },
    });

    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

const user = await tx.staff.create({
  data: {
    ...data.user,
    password: hashedPassword,
    role: UserRole.OWNER,
    orgId: organization.id,
    emailVerifyToken,
    emailVerifyExpiry,
    isEmailVerified: false,
  },
});

    return { user, organization };
  });

  // Send verification email to owner on signup
await sendVerificationEmail(
  result.user.email,
  result.user.name,
  result.user.emailVerifyToken!,
);

const token = generateJwtToken(
  result.user.id,
  result.user.role,
  result.organization.id,
  result.user.serviceId,
);

  const { password, emailVerifyToken, emailVerifyExpiry, passwordResetToken, passwordResetExpiry, ...safeUser } = result.user;

  return { token, user: safeUser, organization: result.organization };
};

const generateJwtToken = (
  id: string,
  role: string,
  orgId: string,
  serviceId: string | null,
): string => {
  if (role !== UserRole.STAFF) {
    serviceId = null;
  }

  const token = jwt.sign({ id, role, orgId, serviceId }, ENV.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

export const login = async (data: loginDto) => {
  const user = await prisma.staff.findUnique({
    where: { email: data.email },
    include: { organization: true },
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateJwtToken(
    user.id,
    user.role,
    user.organization.id,
    user.serviceId,
  );

  const { password, emailVerifyToken, emailVerifyExpiry, passwordResetToken, passwordResetExpiry, ...safeUser } = user;

  return { token, user: safeUser };
};

export const changePassword = async (
  userId: string,
  data: changePasswordDto,
) => {
  const user = await prisma.staff.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid old password", 401);
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, ENV.BCRYPT_SALT);

  await prisma.staff.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};

export const verifyEmail = async (token: string) => {
  const user = await prisma.staff.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired verification link", 400);
  }

  await prisma.staff.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyExpiry: null,
    },
  });

  return { message: "Email verified successfully" };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.staff.findUnique({
    where: { email },
  });

  // Only owner and admin can use forgot password
  if (!user || user.role === UserRole.STAFF) {
    throw new AppError(
      "If you are a desk officer, please contact your administrator to reset your password",
      403,
    );
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      "Your email is not verified. Please verify your email first before resetting your password",
      403,
    );
  }

  const passwordResetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.staff.update({
    where: { id: user.id },
    data: {
      passwordResetToken,
      passwordResetExpiry,
    },
  });

  await sendPasswordResetEmail(user.email, user.name, passwordResetToken);

  return { message: "Password reset link sent to your email" };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.staff.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired password reset link", 400);
  }

  // Only owner and admin can reset password this way
  if (user.role === UserRole.STAFF) {
    throw new AppError(
      "Desk officers cannot reset passwords. Please contact your administrator",
      403,
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, ENV.BCRYPT_SALT);

  await prisma.staff.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  });

  return { message: "Password reset successfully. Please login with your new password" };
};