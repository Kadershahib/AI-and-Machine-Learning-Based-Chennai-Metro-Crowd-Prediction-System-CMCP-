import express from "express";
import cors from "cors";
import morgan from "morgan";

import stationRoutes from "./routes/station.routes";
import predictionRoutes from "./routes/prediction.routes";
import routeRoutes from "./routes/route.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "ok", service: "CMCP backend" }));

app.use("/api/stations", stationRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
