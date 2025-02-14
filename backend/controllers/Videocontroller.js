import { v2 as cloudinary } from "cloudinary";
import { Video } from "../models/Video.model.js";
import { fal } from "@fal-ai/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadVideoUrl = async (req, res) => {
  try {
    const { uploadCareUrl, sourceFileName, transformationParams } = req.body;

    if (!uploadCareUrl || !sourceFileName || !transformationParams) {
      return res.status(400).json({ msg: "Missing required Fields" });
    }

    // Upload video to Cloudinary
    const uploaded = await cloudinary.uploader.upload(uploadCareUrl, {
      resource_type: "video",
    });
    console.log("Uploaded Video URL:", uploaded.secure_url);

    // Save video details to DB
    const videosave = await Video.create({
      sourceVideoUrl: uploaded.secure_url,
      sourceFileName,
      transformationParams,
      processingStatus: "processing",
    });
    console.log("Video saved to DB:", videosave);

    // Respond immediately (don't wait for Fal AI)
    res.status(202).json({
      msg: "Video upload started, processing in background",
      video: videosave,
    });

    // Trigger Fal AI asynchronously
    fal
      .subscribe("fal-ai/hunyuan-video/video-to-video", {
        input: {
          prompt: videosave.transformationParams.prompt,
          video_url: uploaded.secure_url,
        },
        logs: true,
        webhookUrl:
          "https://d164-103-171-133-249.ngrok-free.app/api/videos/webhook",
      })
      .then((result) => console.log("Fal AI Result:", result))
      .catch((error) => console.error("Fal AI Error:", error));
  } catch (e) {
    console.error("Error in uploadVideoUrl:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const webhookUrl = async (req, res) => {
  try {
    const { payload } = req.body;

    return res.json({
      msg: "Webhook received and video status updated",
      video: payload,
    });
  } catch (e) {
    console.error("Error in webhookUrl:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
