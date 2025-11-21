import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";

type UseHlsPlayerOptions = {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
};

export function useHlsPlayer({ src, autoPlay = true, muted = true }: UseHlsPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buffer, setBuffer] = useState(0);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
    video.autoplay = autoPlay;
    let hls: Hls | null = null;
    setReady(false);
    setError(null);

    // Use native HLS on Safari / iOS
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch((err) => setError(err.message));
    } else if (Hls.isSupported()) {
      // NOTE: don't mix duration-based options (liveSyncDuration / liveMaxLatencyDuration)
      // with count-based options (liveSyncDurationCount / liveMaxLatencyDurationCount).
      // Here we use duration-based configuration only.
      hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 30,     // keep a small back buffer
        maxBufferLength: 3,       // smaller buffer to reduce latency
        liveSyncDuration: 1.0,    // seconds of preferred live edge sync
        liveMaxLatencyDuration: 2.0, // max allowed latency in seconds
        maxMaxBufferLength: 5,
        maxBufferHole: 0.5
      });

      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data?.fatal) {
          setError(data?.details ?? "Fatal HLS error");
        } else if (data?.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setError(data?.details ?? "Non-fatal network error");
        }
      });

      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      setError("HLS is not supported in this environment.");
    }

    const onCanPlay = () => {
      setReady(true);
      video.play().catch(() => {
        /* ignore autoplay restrictions */
      });
    };

    video.addEventListener("canplay", onCanPlay);

    const statsInterval = window.setInterval(() => {
      if (!video) return;
      const buffered =
        video.buffered && video.buffered.length
          ? video.buffered.end(video.buffered.length - 1) - video.currentTime
          : 0;
      setBuffer(Math.max(buffered, 0));

      // hls.latency is provided by recent hls.js versions when lowLatencyMode is enabled
      const latencySeconds = (hls as any)?.latency ?? 0;
      setLatency(latencySeconds);
    }, 500);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      window.clearInterval(statsInterval);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay, muted]);

  return useMemo(
    () => ({
      videoRef,
      ready,
      error,
      buffer,
      latency
    }),
    [buffer, error, latency, ready]
  );
}
