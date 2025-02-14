import express from "express";
import {
  GetByIdPoll,
  uploadVideoUrl,
  webhookUrl,
} from "../controllers/Videocontroller.js";

const router = express.Router();

router.post("/upload", uploadVideoUrl);

router.post("/webhook", webhookUrl);

router.get("/:id", GetByIdPoll);

export default router;
