import { CardHeader, CardTitle } from "@/components/ui/card";
import VideoComponent from "@/components/ui/home/VideoComponent";

export default function Home() {
  return (
    <div>
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        <div className="w-full ">
          <CardHeader>
            <CardTitle className="text-3xl">
              AI Video to Video Transformation
            </CardTitle>
          </CardHeader>
          <VideoComponent />
        </div>
      </div>
    </div>
  );
}
