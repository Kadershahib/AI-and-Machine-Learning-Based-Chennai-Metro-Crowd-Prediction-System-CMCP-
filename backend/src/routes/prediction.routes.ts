import { Router } from "express";
import {
  predictForStation,
  predictDayForStation,
  getLiveSnapshot,
} from "../controllers/prediction.controller";

const router = Router();

router.post("/station/:stationId", predictForStation);
router.get("/station/:stationId/day", predictDayForStation);
router.get("/live", getLiveSnapshot);

export default router;
