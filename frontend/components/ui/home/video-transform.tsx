"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetStateAction, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export function VideoTransformPreview({
  videouploaded,
  setvideouploaded,
  videoId,
  setvideoId,
  loader,
  setloader,
  videotransform,
  setvideotransform,
}: {
  videouploaded: boolean;
  setvideouploaded: React.Dispatch<SetStateAction<boolean>>;
  videoId: string;
  setvideoId: React.Dispatch<React.SetStateAction<string>>;
  loader: boolean;
  setloader: React.Dispatch<React.SetStateAction<boolean>>;
  videotransform: boolean;
  setvideotransform: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [downloadedFileName, setDownloadedFileName] = useState("");
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/${videoId}`
      );
      return response.data;
    },
    enabled: videotransform && isPageVisible,
    refetchInterval: false,
  });

  useEffect(() => {
    if (videotransform && isPageVisible) {
      const interval = setInterval(() => {
        refetch();
      }, 7000);

      return () => clearInterval(interval);
    }
  }, [videotransform, isPageVisible, refetch]);

  useEffect(() => {
    if (data?.processingStatus === "completed") {
      setvideotransform(false);
      setloader(false);
    }
  }, [data, setvideotransform, setloader]);

  return (
    <Card className="w-full">
      <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center p-6">
        {videotransform && isPageVisible && (
          <div className="loader">Loading...</div>
        )}

        {data?.processingStatus === "completed" ? (
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
        ) : !videotransform && !data ? (
          <p>No video available</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
