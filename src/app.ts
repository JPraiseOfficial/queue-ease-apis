import express from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.routes.js";
import { globalErrorHandler } from "./common/utils/globalErrorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === SERVER HEALTH CHECK ===
app.get("/", (req, res) => {
  res.json({
    status: "All Engines Running",
  });
});

// === APP ROUTES ===
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);

// === BASE API ROUTE ===
app.use("/api", apiRouter);

// === GLOBAL ERROR HANDLER ===
app.use(globalErrorHandler);

export default app;
