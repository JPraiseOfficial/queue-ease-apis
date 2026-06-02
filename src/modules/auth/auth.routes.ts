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

router.post("/signup", validate(signUpSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post(
  "/change-password",
  auth,
  validate(changePasswordSchema),
  changePassword,
);
router.post("/logout", auth, logout);

export default router;
