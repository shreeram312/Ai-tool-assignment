"use client";
import React, { useState } from "react";
import { VideoTransformForm } from "./video-form";
import { VideoTransformPreview } from "./video-transform";

const VideoComponent = () => {
  const [videouploaded, setvideouploaded] = useState(false);
  const [videodata, setvideodata] = useState<any[]>([]);
  const [videoId, setvideoId] = useState<string>("");
  const [loader, setloader] = useState(false);
  const [videotransform, setvideotransfrom] = useState(false);
  return (
    <div className="sm:flex  gap-10">
      <VideoTransformForm
        videouploaded={videouploaded}
        setvideouploaded={setvideouploaded}
        videodata={videodata}
        setvideodata={setvideodata}
        videoId={videoId}
        setvideoId={setvideoId}
        loader={loader}
        setloader={setloader}
        videotranform={videotransform}
        setvideotransform={setvideotransfrom}
      />
      <div className="w-full my-2">
        <VideoTransformPreview
          videouploaded={videouploaded}
          setvideouploaded={setvideouploaded}
          videoId={videoId}
          setvideoId={setvideoId}
          loader={loader}
          setloader={setloader}
          videotransform={videotransform}
          setvideotransform={setvideotransfrom}
        />
      </div>
    </div>
  );
};

export default VideoComponent;
