"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export function VideoTransformPreview({
  videouploaded,
  setvideouploaded,
  videoId,
  setvideoId,
  loader,
  setloader,
}: {
  videouploaded: boolean;
  setvideouploaded: React.Dispatch<SetStateAction<boolean>>;
  videoId: string;
  setvideoId: React.Dispatch<React.SetStateAction<string>>;
  loader: boolean;
  setloader: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [downloadedFileName, setDownloadedFileName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/${videoId}`
      );
      return response.data;
    },
    enabled: videouploaded,
    refetchInterval: (queryData) =>
      //@ts-ignore
      queryData?.processingStatus === "processing" ? 7000 : false,
  });

  return (
    <Card className="w-full">
      <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center p-6">
        {videoId}
        {isLoading ? (
          <p>Loading...</p>
        ) : data && data.processingStatus === "completed" ? (
          <div className="flex flex-col items-center">
            <video
              src={data.processedVideoUrl}
              controls
              className="w-full max-w-lg mb-4"
            />
            <Button asChild>
              <a
                href={data.processedVideoUrl}
                download={data.downloadedFileName}
              >
                Download {data.downloadedFileName}
              </a>
            </Button>
          </div>
        ) : (
          <p>No video available</p>
        )}
      </CardContent>
    </Card>
  );
}
