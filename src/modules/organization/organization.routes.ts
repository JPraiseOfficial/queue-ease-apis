import { Router } from "express";
import * as organizationController from "./organization.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { auth } from "../../common/middlewares/auth.middleware.js";
import { updateOrganizationSchema } from "./organization.schema.js";
import { authorize } from "../../common/middlewares/role.middleware.js";

const router = Router();

router.get("/", auth, organizationController.getOrg);

router.patch(
  "/edit",
  auth,
  authorize(["owner"]),
  validate(updateOrganizationSchema),
  organizationController.updateOrg,
);

router.delete(
  "/delete",
  auth,
  authorize(["owner"]),
  organizationController.deleteOrg,
);

export default router;
