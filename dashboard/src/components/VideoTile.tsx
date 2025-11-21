import { useEffect } from "react";
import type { StreamSource } from "../types/stream";
import { useHlsPlayer } from "../hooks/useHlsPlayer";
import { usePlayerRegistration, useSyncStore } from "../store/useSyncStore";
import clsx from "clsx";

type VideoTileProps = {
  stream: StreamSource;
};

export function VideoTile({ stream }: VideoTileProps) {
  const { videoRef, ready, error, buffer, latency } = useHlsPlayer({
    src: stream.playlist
  });

  usePlayerRegistration(stream.id, videoRef);

  const clockId = useSyncStore((s) => s.clockId);
  const drift = useSyncStore((s) => s.players[stream.id]?.lastDrift ?? 0);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.src = "";
      }
    };
  }, [videoRef]);

  return (
    <div className="rounded-2xl border border-white/5 bg-surface/60 p-4 shadow-2xl">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
        <video
          ref={videoRef}
          playsInline
          muted
          className={clsx(
            "h-full w-full object-cover transition-opacity",
            ready ? "opacity-100" : "opacity-30"
          )}
        />
        <div className="pointer-events-none absolute left-0 top-0 flex w-full justify-between bg-gradient-to-r from-black/70 to-transparent p-3 text-xs font-semibold uppercase tracking-widest text-white/80">
          <span>{stream.name ?? stream.id}</span>
          {clockId === stream.id && <span>Clock Source</span>}
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-[0.7rem] text-slate-200">
          <div>Latency: {latency.toFixed(2)}s</div>
          <div>Buffer: {buffer.toFixed(2)}s • Drift: {drift.toFixed(3)}s</div>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-xs text-red-400">
          {error} — verify the HLS playlist.
        </p>
      )}
    </div>
  );
}






