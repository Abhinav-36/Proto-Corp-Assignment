import "./App.css";
import { VideoWall } from "./components/VideoWall";
import { SyncControls } from "./components/SyncControls";
import { DiagnosticsPanel } from "./components/DiagnosticsPanel";
import { useStreamData } from "./hooks/useStreamData";
import { SyncPulse } from "./components/SyncPulse";

function App() {
  const { streams, loading, error, reload } = useStreamData();

  return (
    <div className="app-shell">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Proto Corp
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Video Streaming Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            React + HLS multi-view monitor with drift-aware synchronization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reload}
            className="rounded-full border border-accent/40 bg-surface px-4 py-2 text-sm text-accent transition hover:border-accent"
          >
            Reload Streams
          </button>
          <SyncPulse />
        </div>
      </header>

      <main className="grid-layout">
        <section className="panel col-span-full">
          <SyncControls />
        </section>

        <section className="panel col-span-full">
          {loading && (
            <p className="text-slate-400">Loading stream topology…</p>
          )}
          {error && (
            <p className="text-red-400">
              Failed to load stream map: {error}. Check your HLS pipeline.
            </p>
          )}
          {!loading && !error && <VideoWall streams={streams} />}
        </section>

        <section className="panel col-span-full">
          <DiagnosticsPanel />
        </section>
      </main>
    </div>
  );
}

export default App;






