import { Router } from "express";
import * as serviceController from "./service.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { auth } from "../../common/middlewares/auth.middleware.js";
import { authorize } from "../../common/middlewares/role.middleware.js";
import { createServiceSchema, updateServiceSchema } from "./service.schema.js";
import { idParamSchema } from "../../common/utils/schema.common.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Service
 *   description: Service management API endpoints
 */

router.use(auth);
router.use(authorize(["owner", "admin"]));

/**
 * @swagger
 * /service:
 *   post:
 *     summary: Create a new service
 *     tags: [Service]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post(
  "/",
  validate(createServiceSchema),
  serviceController.createService,
);

/**
 * @swagger
 * /service:
 *   get:
 *     summary: Get all services for the organization
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all services
 */
router.get("/", serviceController.getAllServices);

/**
 * @swagger
 * /service/{id}:
 *   get:
 *     summary: Get a specific service by ID
 *     tags: [Service]
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
 *         description: Successfully retrieved service
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Service not found
 */
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  serviceController.getService,
);

/**
 * @swagger
 * /service/{id}/edit:
 *   patch:
 *     summary: Update a specific service
 *     tags: [Service]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
router.patch(
  "/:id/edit",
  validate(idParamSchema, "params"),
  validate(updateServiceSchema),
  serviceController.updateService,
);

/**
 * @swagger
 * /service/{id}/delete:
 *   delete:
 *     summary: Delete a specific service
 *     tags: [Service]
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
 *         description: Service deleted successfully
 */
router.delete(
  "/:id/delete",
  validate(idParamSchema, "params"),
  serviceController.deleteService,
);

export default router;
