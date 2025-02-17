"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import toast from "react-hot-toast";
import { Button } from "../button";
import axiosInstance from "@/lib/axiosInstance";

type VideoData = {
  msg: string;
  video: {
    sourceVideoUrl: string;
    sourceFileName: string;
    transformationParams: {
      prompt: string;
      steps: number;
      aspectRatio: string;
      resolution: string;
      frames: string;
      seed: string;
      strength: number;
    };
  };
  requestId: string | null;
  processedVideoUrl: string | null;
  processingStatus: string;
  downloadedFileName: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export function VideoTransformForm({
  videouploaded,
  setvideouploaded,
  videodata,
  setvideodata,
  videoId,
  setvideoId,
  loader,
  setloader,
}: {
  videouploaded: boolean;
  setvideouploaded: React.Dispatch<React.SetStateAction<boolean>>;
  videodata: VideoData[];
  setvideodata: React.Dispatch<React.SetStateAction<VideoData[]>>;
  videoId: string;
  setvideoId: React.Dispatch<React.SetStateAction<string>>;
  loader: boolean;
  setloader: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState(10);
  const [seed, setSeed] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("720p");
  const [frames, setFrames] = useState<number | null>(85);
  const [strength, setStrength] = useState(0.85);
  const [cdnurl, setcdnurl] = useState("");
  const [fileName, setfileName] = useState("");

  useEffect(() => {
    console.log("Video uploaded:", videouploaded);
  }, [videouploaded]);

  async function handleVideoTransform() {
    try {
      console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/upload`,
        {
          uploadCareUrl: cdnurl,
          sourceFileName: fileName,
          transformationParams: {
            prompt: prompt,
            steps: steps,
            aspectRatio: aspectRatio,
            resolution: resolution,
            frames: frames,
            seed: seed,
            strength: strength,
          },
        }
      );

      console.log("the res is ......", res);
      toast.success("Video Uploaded, Converting in Backend,Please wait ");
      setvideodata(res.data);
      setvideoId(res.data.video._id);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="grid gap-6">
        <div className="p-6 flex flex-col items-center gap-2">
          {videoId}
          <Upload className="w-8 h-8 text-muted-foreground" />
          <button disabled={!videouploaded}>
            {videouploaded && <p className="text-black">Video Uploaded...</p>}
            {!videouploaded && (
              <FileUploaderRegular
                //@ts-ignore
                multiple="false"
                //@ts-ignore

                sourceList="local, facebook, gdrive"
                cameraModes="video"
                pubkey="355b5773ace9cc492272"
                onFileUploadFailed={(e) => {
                  toast.error(e.errors[0].message);
                }}
                onFileAdded={async (e) => {}}
                onFileUploadSuccess={(e) => {
                  // console.log(e.fileInfo.name);
                  setfileName(e.fileInfo.name);
                  toast.success(e.cdnUrl);
                  setvideouploaded(true);
                  setcdnurl(e.cdnUrl);
                }}
                store="auto"
              />
            )}
          </button>
        </div>

        {videouploaded && <div>Video Uploaded now wait</div>}
        <div className="grid gap-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your transformation prompt..."
          />
        </div>

        <Label htmlFor="steps">Inference Steps</Label>
        <Slider
          id="steps"
          value={[steps]}
          onValueChange={(value) => setSteps(value[0])}
          max={30}
          step={1}
        />
        <p>Selected Steps: {steps}</p>

        <Label htmlFor="seed">Seed</Label>
        <Input
          id="seed"
          type="number"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="Enter seed number..."
        />

        <Label htmlFor="aspect">Aspect Ratio</Label>
        <Select
          defaultValue="16:9"
          value={aspectRatio}
          onValueChange={setAspectRatio}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16:9">16:9</SelectItem>
            <SelectItem value="9:16">9:16</SelectItem>
          </SelectContent>
        </Select>

        <Label htmlFor="resolution">Resolution</Label>
        <Select
          defaultValue="720p"
          value={resolution}
          onValueChange={setResolution}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select resolution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="480p">480p</SelectItem>
            <SelectItem value="720p">720p</SelectItem>
          </SelectContent>
        </Select>

        <Label htmlFor="frames">Number of Frames</Label>
        <Select
          value={frames?.toString()}
          onValueChange={(value) => setFrames(Number(value))}
          defaultValue="85"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select number of frames" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="129">129</SelectItem>
            <SelectItem value="85">85</SelectItem>
          </SelectContent>
        </Select>

        <Label htmlFor="strength">Strength</Label>
        <Slider
          id="strength"
          value={[strength]}
          onValueChange={(value) => setStrength(value[0])}
          max={1}
          step={0.01}
        />
        <p>Selected Strength: {strength}</p>
      </CardContent>

      <Button
        onClick={handleVideoTransform}
        disabled={!videouploaded}
        className="flex justify-center items-center mx-auto mb-2"
      >
        Start Transformation
      </Button>

      {videoId}
    </Card>
  );
}
