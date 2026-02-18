import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { registerRoutes } from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
