import { Router } from "express";
import { login, signup, logout, changePassword } from "./auth.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import {
  changePasswordSchema,
  loginSchema,
  signUpSchema,
} from "./auth.schema.js";
import { auth } from "../../common/middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and User Management
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user and organization
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - name
 *                   - email
 *                   - phone
 *                   - password
 *                 properties:
 *                   name:
 *                     type: string
 *                     minLength: 5
 *                   email:
 *                     type: string
 *                     format: email
 *                   phone:
 *                     type: string
 *                     minLength: 11
 *                   password:
 *                     type: string
 *                     minLength: 6
 *               organization:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   location:
 *                     type: string
 *                   availability:
 *                     type: string
 *                   openingTime:
 *                     type: string
 *                     example: "09:00"
 *                   closingTime:
 *                     type: string
 *                     example: "17:00"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Conflict - User Email or Phone already exists
 */
router.post("/signup", validate(signUpSchema), signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Invalid old password / Unauthorized
 *       404:
 *         description: User not found
 */
router.post(
  "/change-password",
  auth,
  validate(changePasswordSchema),
  changePassword,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", auth, logout);

export default router;
