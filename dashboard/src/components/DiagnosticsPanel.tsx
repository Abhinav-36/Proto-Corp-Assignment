import { useMemo } from "react";
import { useSyncStore } from "../store/useSyncStore";

export function DiagnosticsPanel() {
  const players = useSyncStore((s) => s.players);
  const clockId = useSyncStore((s) => s.clockId);
  const tolerance = useSyncStore((s) => s.tolerance);

  const rows = useMemo(() => Object.entries(players), [players]);

  if (!rows.length) {
    return <p className="text-sm text-slate-500">No players registered yet.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.4em] text-slate-500">
        <span>Diagnostics</span>
        <span>Tolerance: {tolerance.toFixed(2)}s</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Stream</th>
              <th className="px-4 py-3">Drift (s)</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([id, handle]) => {
              const drift = handle.lastDrift ?? 0;
              const severity = Math.abs(drift) > tolerance ? "text-red-400" : "text-emerald-400";
              return (
                <tr key={id} className="border-t border-white/5">
                  <td className="px-4 py-2 font-mono text-xs text-white">
                    {id}
                    {clockId === id && <span className="ml-2 rounded-full border border-accent/40 px-2 py-0.5 text-[0.6rem] uppercase text-accent">clock</span>}
                  </td>
                  <td className={["px-4 py-2 font-semibold", severity].join(" ")}>
                    {drift.toFixed(3)}
                  </td>
                  <td className="px-4 py-2 text-slate-400">
                    {Math.abs(drift) > tolerance ? "Realigning…" : "In sync"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}






