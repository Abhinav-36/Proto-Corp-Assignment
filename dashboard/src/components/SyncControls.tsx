import { useMemo } from "react";
import { useSyncStore } from "../store/useSyncStore";

export function SyncControls() {
  const players = useSyncStore((s) => s.players);
  const clockId = useSyncStore((s) => s.clockId);
  const tolerance = useSyncStore((s) => s.tolerance);
  const setTolerance = useSyncStore((s) => s.setTolerance);
  const setClock = useSyncStore((s) => s.setClock);
  const syncNow = useSyncStore((s) => s.syncNow);

  const options = useMemo(() => Object.keys(players), [players]);

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Clock Source
        </p>
        <select
          value={clockId ?? ""}
          onChange={(event) => setClock(event.target.value)}
          className="mt-2 rounded-lg border border-white/10 bg-surface px-4 py-2 text-sm text-white"
        >
          <option value="" disabled>
            Select stream
          </option>
          {options.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Drift Tolerance (seconds)
        </p>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={tolerance}
            onChange={(event) => setTolerance(Number(event.target.value))}
            className="w-48"
          />
          <span className="text-sm text-slate-200">{tolerance.toFixed(2)}s</span>
        </div>
      </div>

      <button
        type="button"
        onClick={syncNow}
        className="rounded-full border border-accent/40 px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent hover:text-white"
      >
        Force Re-Sync
      </button>
    </div>
  );
}






