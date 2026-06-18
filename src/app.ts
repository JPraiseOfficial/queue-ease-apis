import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";
import { globalErrorHandler } from "./common/utils/globalErrorHandler.js";
import authRouter from "./modules/auth/auth.routes.js";
import orgRouter from "./modules/organization/organization.routes.js";
import predictionRouter from "./integrations/ml-prediction/prediction.routes.js";
import serviceRouter from "./modules/services/service.routes.js";
import staffRouter from "./modules/staff/staff.routes.js";
import ticketRouter from "./modules/ticket/ticket.routes.js";
import queueRouter from "./modules/queue/queue.routes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === SERVER HEALTH CHECK ===
app.get("/", (req, res) => {
  res.json({
    status: "All Engines Running",
  });
});

// === SWAGGER DOCS ===
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === APP ROUTES ===
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/org", orgRouter);
apiRouter.use("/service", serviceRouter);
apiRouter.use("/staff", staffRouter);
apiRouter.use("/ticket", ticketRouter);
apiRouter.use("/queue", queueRouter);

apiRouter.use("/prediction", predictionRouter);

// === BASE API ROUTE ===
app.use("/api", apiRouter);

// === GLOBAL ERROR HANDLER ===
app.use(globalErrorHandler);

export default app;
