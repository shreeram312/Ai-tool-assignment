"use client";
import type React from "react";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function VideoTransformForm() {
  const [videoUrl, setVideoUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onVideoChange = (file: File | null, url: string) => {
    setVideoFile(file);
    setVideoUrl(url);
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
        setVideoUrl("");
        onVideoChange(file, "");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
        setVideoUrl("");
        onVideoChange(file, "");
      }
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setVideoFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onVideoChange(null, "");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Video Transformation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label>Input Video</Label>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg transition-colors",
              dragActive ? "border-primary bg-primary/10" : "border-muted",
              videoFile && "border-success bg-success/10"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              onChange={handleChange}
              className="hidden"
            />

            {videoFile ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{videoFile.name}</div>
                  <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <video className="w-full rounded-lg">
                  <source
                    src={URL.createObjectURL(videoFile)}
                    type={videoFile.type}
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Drag and drop your video here, or{" "}
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="text-primary hover:underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-muted-foreground">
                  Or provide a URL below
                </p>
              </div>
            )}
          </div>

          <Input
            type="url"
            placeholder="Or enter video URL..."
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setVideoFile(null);
              onVideoChange(null, e.target.value);
            }}
            className="mt-2"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Input
            id="prompt"
            placeholder="Enter your transformation prompt..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="steps">Inference Steps</Label>
          <Slider
            id="steps"
            defaultValue={[30]}
            max={100}
            step={1}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
          <p className="text-xs text-muted-foreground">
            Lower gets faster results, higher gets better results
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="seed">Seed</Label>
          <Input id="seed" type="number" placeholder="Enter seed number..." />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="aspect">Aspect Ratio</Label>
          <Select defaultValue="16:9">
            <SelectTrigger id="aspect">
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9</SelectItem>
              <SelectItem value="9:16">9:16</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="resolution">Resolution</Label>
          <Select defaultValue="720p">
            <SelectTrigger id="resolution">
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="480p">480p</SelectItem>
              <SelectItem value="580p">580p</SelectItem>
              <SelectItem value="720p">720p</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="frames">Number of Frames</Label>
          <Select defaultValue="129">
            <SelectTrigger id="frames">
              <SelectValue placeholder="Select number of frames" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="129">129</SelectItem>
              <SelectItem value="85">85</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="strength">Strength</Label>
          <Slider
            id="strength"
            defaultValue={[0.85]}
            max={1}
            step={0.01}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
          <p className="text-xs text-muted-foreground">Default: 0.85</p>
        </div>
      </CardContent>
    </Card>
  );
}
