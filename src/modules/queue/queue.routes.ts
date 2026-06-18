import { Router } from "express";
import * as queueStatsController from "./queue.controller.js";
import { auth } from "../../common/middlewares/auth.middleware.js";
import { authorize } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { serviceIdParamSchema } from "../../common/utils/schema.common.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Queue Status
 *   description: Queue Status and Metrics endpoints
 */

router.use(auth, authorize(["owner", "admin"]));

/**
 * @swagger
 * /queue/overall-status:
 *   get:
 *     summary: Get overall queue live status
 *     tags: [Queue Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved overall status
 */
router.get("/overall-status", queueStatsController.overallQueueLiveStatus);

/**
 * @swagger
 * /queue/status/{serviceId}:
 *   get:
 *     summary: Get live status for a specific service queue
 *     tags: [Queue Status]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the service
 *     responses:
 *       200:
 *         description: Successfully retrieved service queue status
 */
router.get(
  "/status/:serviceId",
  validate(serviceIdParamSchema, "params"),
  queueStatsController.serviceQueueLiveStatus,
);

export default router;
