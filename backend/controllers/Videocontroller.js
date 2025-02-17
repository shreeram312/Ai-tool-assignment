import { v2 as cloudinary } from "cloudinary";
import { Video } from "../models/videomodel.js";
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
    console.log("Video saver:", videosave);

    res.status(202).json({
      msg: "Video upload started, processing in background",
      video: videosave,
    });

    const result = await fal.subscribe("fal-ai/hunyuan-video/video-to-video", {
      input: {
        prompt: videosave.transformationParams.prompt,
        num_inference_steps: videosave.transformationParams.steps,
        aspect_ratio: videosave.transformationParams.aspectRatio,
        resolution: videosave.transformationParams.resolution,
        num_frames: videosave.transformationParams.frames,
        enable_safety_checker: true,
        video_url: videosave.sourceVideoUrl,
        strength: videosave.transformationParams.strength,
      },
      logs: true,
      webhookUrl: `${process.env.BACKEND_URL}?videoId=${videosave._id}`,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    console.log(result.data);
    console.log(result.requestId);
  } catch (e) {
    console.error("Error in uploadVideoUrl:", e);
  }
};

export const webhookUrl = async (req, res) => {
  try {
    const videoId = req.query.videoId;
    // console.log("Webhook payload: ", req.body);
    const { payload } = req.body;
    // console.log("Payload is ", payload);

    if (payload.video.url) {
      const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          processedVideoUrl: payload.video.url,
          processingStatus: "completed",
          downloadedFileName: payload.video.file_name,
        },
        { new: true }
      );
    }

    // console.log("updatedVideo is  ", updatedVideo);

    return res.json({
      msg: "Webhook received and video status updated",
      video: payload,
    });
  } catch (e) {
    console.error("Error in webhookUrl:", e);
    return res.status(500).json({ error: "Internal Server Error bubu" });
  }
};

export const GetByIdPoll = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const video = await Video.findById(id);
    console.log(video);
    if (!video) {
      return res.json({
        msg: "No video found yet",
      });
    }

    res.json({
      processingStatus: video.processingStatus,
      processedVideoUrl: video.processedVideoUrl,
      downloadedFileName: video.downloadedFileName,
    });
  } catch (e) {
    console.log(e);
    throw new Error("Error from server,Please try Later");
  }
};
