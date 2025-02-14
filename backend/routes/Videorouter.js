import express from "express";
import { uploadVideoUrl, webhookUrl } from "../controllers/Videocontroller.js";

const router = express.Router();

router.post("/upload", uploadVideoUrl);

router.post("/webhook", webhookUrl);

export default router;
