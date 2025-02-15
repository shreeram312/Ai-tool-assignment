import { VideoTransformForm } from "@/components/ui/home/video-form";
import { VideoTransformPreview } from "@/components/ui/home/video-transform";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <VideoTransformForm />
        </div>
        <div className="w-full md:w-1/2">
          <VideoTransformPreview />
        </div>
      </div>
    </div>
  );
}
