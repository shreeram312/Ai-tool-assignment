"use client";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetStateAction, useState } from "react";

export function VideoTransformPreview({
  videouploaded,
  setvideouploaded,
}: {
  videouploaded: boolean;
  setvideouploaded: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <Card className="w-full">
      <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center p-6">
        {!videoFile && !videoUrl ? (
          <div className="grid gap-2">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">Ready to Transform</h3>
            <p className="text-sm text-muted-foreground">
              Upload a video or provide a URL to get started
            </p>
          </div>
        ) : (
          <div className="w-full grid gap-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            {videoFile ? (
              <video controls className="w-full rounded-lg">
                <source
                  src={URL.createObjectURL(videoFile)}
                  type={videoFile.type}
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              videoUrl && (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Video URL Preview
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
