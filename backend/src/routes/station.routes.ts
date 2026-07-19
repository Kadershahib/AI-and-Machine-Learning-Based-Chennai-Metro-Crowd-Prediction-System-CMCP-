import { Router } from "express";
import { getAllStations, getStationById } from "../controllers/station.controller";

const router = Router();

router.get("/", getAllStations);
router.get("/:id", getStationById);

export default router;
