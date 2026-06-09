import { Router } from "express";
import * as staffController from "./staff.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { auth } from "../../common/middlewares/auth.middleware.js";
import { authorize } from "../../common/middlewares/role.middleware.js";
import { createStaffSchema, updateStaffSchema, changeRoleSchema } from "./staff.schema.js";
import { idParamSchema } from "../../common/utils/schema.common.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff management API endpoints
 */

router.use(auth);

/**
 * @swagger
 * /staff/profile:
 *   get:
 *     summary: View own profile
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/profile", staffController.viewProfile);

// THE ENDPOINTS BELOW THIS LINE ARE RESTRICTED TO ADMIN AND OWNERS ONLY
router.use(authorize(["owner", "admin"]));

/**
 * @swagger
 * /staff/profile/edit:
 *   patch:
 *     summary: Edit own profile
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               serviceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal Server Error
 */
router.patch(
  "/profile/edit",
  validate(updateStaffSchema),
  staffController.editProfile,
);

/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Create a new staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - role
 *               - serviceId
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               serviceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Staff created successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service not found for organization
 *       409:
 *         description: Conflict - Staff Email or Phone already exists
 *       500:
 *         description: Internal Server Error
 */
router.post("/", validate(createStaffSchema), staffController.createStaff);

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get all staff for the organization
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all staff
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get("/", staffController.getAllStaff);

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Get a specific staff by ID
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved staff
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", validate(idParamSchema, "params"), staffController.getStaff);

/**
 * @swagger
 * /staff/{id}/edit:
 *   patch:
 *     summary: Update a specific staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               serviceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden / Unauthorized access
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Internal Server Error
 */
router.patch(
  "/:id/edit",
  validate(idParamSchema, "params"),
  validate(updateStaffSchema),
  staffController.updateStaff,
);

/**
 * @swagger
 * /staff/{id}/role:
 *   patch:
 *     summary: Change staff role
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Staff role updated successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden / Unauthorized access
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Internal Server Error
 */
router.patch(
  "/:id/role",
  validate(idParamSchema, "params"),
  validate(changeRoleSchema),
  staffController.changeRole,
);

/**
 * @swagger
 * /staff/{id}/delete:
 *   delete:
 *     summary: Delete a specific staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden / Unauthorized access
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/:id/delete",
  validate(idParamSchema, "params"),
  staffController.deleteStaff,
);

export default router;
