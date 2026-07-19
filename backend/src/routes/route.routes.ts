import { Router } from "express";
import { suggestBestTime } from "../controllers/route.controller";

const router = Router();

router.post("/best-time", suggestBestTime);

export default router;
