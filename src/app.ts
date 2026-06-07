import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";
import authRouter from "./modules/auth/auth.routes.js";
import orgRouter from "./modules/organization/organization.routes.js";
import { globalErrorHandler } from "./common/utils/globalErrorHandler.js";
import predictionRouter from "./modules/prediction/prediction.routes.js";

const app = express();

// app.use(cors());
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
apiRouter.use("/prediction", predictionRouter);
// === BASE API ROUTE ===
app.use("/api", apiRouter);

// === GLOBAL ERROR HANDLER ===
app.use(globalErrorHandler);

export default app;
