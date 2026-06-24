import axios from "axios";
import { ENV } from "../../config/env.js";

const sendViaBrevo = async (
  to: string,
  name: string,
  subject: string,
  htmlContent: string,
) => {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: "QueueEase", email: ENV.BREVO_SENDER },
      to: [{ email: to, name }],
      subject,
      htmlContent,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": ENV.BREVO_API_KEY,
      },
    },
  );
};

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string,
) => {
  const verificationLink = `${ENV.APP_URL}/api/auth/verify-email?token=${token}`;

  await sendViaBrevo(
    email,
    name,
    "Verify your email address",
    `
    <h2>Hi ${name},</h2>
    <p>Welcome to QueueEase! Please verify your email address by clicking the link below:</p>
    <a href="${verificationLink}" style="
      background-color: #4F46E5;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin: 16px 0;
    ">Verify Email</a>
    <p>This link expires in <strong>24 hours</strong>.</p>
    <p>If you did not create a QueueEase account, ignore this email.</p>
  `,
  );
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string,
) => {
  const resetLink = `${ENV.APP_URL}/api/auth/reset-password?token=${token}`;

  await sendViaBrevo(
    email,
    name,
    "Reset your password",
    `
    <h2>Hi ${name},</h2>
    <p>We received a request to reset your QueueEase password. Click the link below to proceed:</p>
    <a href="${resetLink}" style="
      background-color: #4F46E5;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin: 16px 0;
    ">Reset Password</a>
    <p>This link expires in <strong>1 hour</strong>.</p>
    <p>If you did not request a password reset, ignore this email.</p>
  `,
  );
};