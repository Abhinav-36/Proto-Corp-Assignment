import type { StreamSource } from "../types/stream";
import { VideoTile } from "./VideoTile";

type VideoWallProps = {
  streams: StreamSource[];
};

export function VideoWall({ streams }: VideoWallProps) {
  if (!streams.length) {
    return (
      <div className="text-center text-slate-500">
        No streams registered. Populate <code>streams.json</code> or point the
        app to a custom endpoint via <code>VITE_STREAM_SOURCE</code>.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {streams.map((stream) => (
        <VideoTile key={stream.id} stream={stream} />
      ))}
    </div>
  );
}






