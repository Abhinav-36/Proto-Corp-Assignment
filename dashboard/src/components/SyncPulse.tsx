import { useEffect, useState } from "react";
import { useSyncStore } from "../store/useSyncStore";
import clsx from "clsx";

export function SyncPulse() {
  const syncNow = useSyncStore((s) => s.syncNow);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // More frequent sync for better alignment (every 500ms)
    const interval = window.setInterval(() => {
      syncNow();
      setTimestamp(Date.now());
      setArmed((prev) => !prev);
    }, 500);

    return () => window.clearInterval(interval);
  }, [syncNow]);

  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest",
        armed ? "text-accent" : "text-slate-300"
      )}
    >
      <span
        className={clsx(
          "inline-block h-2 w-2 rounded-full",
          armed ? "bg-accent shadow-[0_0_10px_#41d1ff]" : "bg-slate-500"
        )}
      />
      Auto Sync • {new Date(timestamp).toLocaleTimeString()}
    </div>
  );
}





