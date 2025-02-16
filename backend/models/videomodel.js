import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    sourceVideoUrl: { type: String, required: true },
    sourceFileName: { type: String, required: true },

    transformationParams: { type: Object, required: true },
    requestId: {
      type: String,
      default: null,
    },

    processedVideoUrl: { type: String, default: null },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    downloadedFileName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", VideoSchema);
