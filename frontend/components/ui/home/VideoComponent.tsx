"use client";
import React, { useState } from "react";
import { VideoTransformForm } from "./video-form";
import { VideoTransformPreview } from "./video-transform";
import { CardHeader, CardTitle } from "../card";

const VideoComponent = () => {
  const [videouploaded, setvideouploaded] = useState(false);
  const [videodata, setvideodata] = useState<any[]>([]);
  const [videoId, setvideoId] = useState<string>("");
  return (
    <div className="sm:flex  gap-10">
      <VideoTransformForm
        videouploaded={videouploaded}
        setvideouploaded={setvideouploaded}
        videodata={videodata}
        setvideodata={setvideodata}
        videoId={videoId}
        setvideoId={setvideoId}
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
