import { useEffect, type MutableRefObject } from "react";
import { create } from "zustand";
import { syncPlayers } from "../utils/sync";

export type PlayerHandle = {
  ref: MutableRefObject<HTMLVideoElement | null>;
  lastDrift: number;
};

type SyncState = {
  players: Record<string, PlayerHandle>;
  clockId: string | null;
  tolerance: number;
  registerPlayer: (
    id: string,
    ref: MutableRefObject<HTMLVideoElement | null>
  ) => void;
  unregisterPlayer: (id: string) => void;
  setClock: (id: string) => void;
  setTolerance: (value: number) => void;
  syncNow: () => void;
  updateDrift: (id: string, drift: number) => void;
};

export const useSyncStore = create<SyncState>((set, get) => ({
  players: {},
  clockId: null,
  tolerance: 0.35,
  registerPlayer: (id, ref) =>
    set((state) => ({
      players: {
        ...state.players,
        [id]: { ref, lastDrift: 0 }
      },
      clockId: state.clockId ?? id
    })),
  unregisterPlayer: (id) =>
    set((state) => {
      if (!(id in state.players)) return state;
      const players = { ...state.players };
      delete players[id];
      const remainingIds = Object.keys(players);
      return {
        players,
        clockId:
          state.clockId === id ? remainingIds.at(0) ?? null : state.clockId
      };
    }),
  setClock: (id) => set(() => ({ clockId: id })),
  setTolerance: (value) => set(() => ({ tolerance: value })),
  syncNow: () => syncPlayers(get(), set),
  updateDrift: (id, drift) =>
    set((state) =>
      id in state.players
        ? {
            players: {
              ...state.players,
              [id]: {
                ...state.players[id],
                lastDrift: drift
              }
            }
          }
        : state
    )
}));

export function usePlayerRegistration(
  id: string,
  ref: MutableRefObject<HTMLVideoElement | null>
) {
  const register = useSyncStore((s) => s.registerPlayer);
  const unregister = useSyncStore((s) => s.unregisterPlayer);

  useEffect(() => {
    register(id, ref);
    return () => unregister(id);
  }, [id, ref, register, unregister]);
}


