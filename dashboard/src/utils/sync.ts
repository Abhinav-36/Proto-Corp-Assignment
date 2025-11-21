import type { StoreApi } from "zustand";
import type { PlayerHandle } from "../store/useSyncStore";

type SyncSlice = {
  players: Record<string, PlayerHandle>;
  clockId: string | null;
  tolerance: number;
  updateDrift: (id: string, drift: number) => void;
};

export function syncPlayers(
  state: SyncSlice,
  set: StoreApi<SyncSlice>["setState"]
) {
  const { players, clockId, tolerance } = state;
  if (!clockId) return;

  const clock = players[clockId]?.ref.current;
  if (!clock || clock.readyState < 2) return; // Wait for video to have enough data

  const clockTime = clock.currentTime;

  Object.entries(players).forEach(([id, handle]) => {
    const video = handle.ref.current;
    if (!video || id === clockId || video.readyState < 2) return;

    const drift = video.currentTime - clockTime;
    state.updateDrift(id, drift);

    if (Number.isNaN(drift) || !isFinite(drift)) {
      return;
    }

    const absDrift = Math.abs(drift);

    // Large drift: use gradual correction instead of hard jump
    if (absDrift > tolerance) {
      // Use gradual correction (30% of drift) to avoid freezing
      const correction = (clockTime - video.currentTime) * 0.3;
      const newTime = video.currentTime + correction;
      
      // Only correct if the new time is valid
      if (newTime >= 0 && newTime <= video.duration) {
        video.currentTime = newTime;
      } else {
        // Fallback to direct sync if gradual correction fails
        video.currentTime = clockTime;
      }
      video.playbackRate = 1.0;
      return;
    }

    // Medium drift: use playback rate adjustment
    if (absDrift > tolerance / 2) {
      // More subtle rate adjustment
      const rateAdjustment = drift > 0 ? 0.98 : 1.02;
      video.playbackRate = rateAdjustment;
      
      // Reset rate after adjustment period
      window.setTimeout(() => {
        if (video && video.playbackRate !== 1.0) {
          video.playbackRate = 1.0;
        }
      }, 300);
    } else {
      // Small drift: maintain normal playback
      video.playbackRate = 1.0;
    }
  });
}


