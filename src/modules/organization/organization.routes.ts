import { Router } from "express";
import * as organizationController from "./organization.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { auth } from "../../common/middlewares/auth.middleware.js";
import { updateOrganizationSchema } from "./organization.schema.js";
import { authorize } from "../../common/middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Organization management API endpoints
 */

/**
 * @swagger
 * /org:
 *   get:
 *     summary: Get current organization details
 *     description: Retrieves the details of the organization associated with the currently authenticated user.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved organization details
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Organization not found
 */
router.get("/", auth, organizationController.getOrg);

/**
 * @swagger
 * /org/edit:
 *   patch:
 *     summary: Update organization details
 *     description: Modifies an existing organization. Requires the user to be authenticated and have the 'owner' role.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: The organization fields to update
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               availability:
 *                 type: string
 *               openingTime:
 *                 type: string
 *               closingTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated organization
 *       400:
 *         description: Validation error in the request body
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (Owner role required)
 */
router.patch(
  "/edit",
  auth,
  authorize(["owner"]),
  validate(updateOrganizationSchema),
  organizationController.updateOrg,
);

/**
 * @swagger
 * /org/delete:
 *   delete:
 *     summary: Delete an organization
 *     description: Removes an organization from the system. Requires the user to be authenticated and have the 'owner' role.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted organization
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (Owner role required)
 */
router.delete(
  "/delete",
  auth,
  authorize(["owner"]),
  organizationController.deleteOrg,
);

export default router;
