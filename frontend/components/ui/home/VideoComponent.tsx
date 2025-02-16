"use client";
import React, { useState } from "react";
import { VideoTransformForm } from "./video-form";
import { VideoTransformPreview } from "./video-transform";
import { CardHeader, CardTitle } from "../card";

const VideoComponent = () => {
  const [videouploaded, setvideouploaded] = useState(false);
  return (
    <div className="sm:flex  gap-10">
      <VideoTransformForm
        videouploaded={videouploaded}
        setvideouploaded={setvideouploaded}
      />
      <div className="w-full my-2">
        <VideoTransformPreview
          videouploaded={videouploaded}
          setvideouploaded={setvideouploaded}
        />
      </div>
    </div>
  );
};

export default VideoComponent;
