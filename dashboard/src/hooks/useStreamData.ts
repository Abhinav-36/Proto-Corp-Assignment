import { useCallback, useEffect, useState } from "react";
import type { StreamSource } from "../types/stream";

// Backend API endpoint (fallback to local file if backend not available)
const API_BASE = import.meta.env.VITE_API_BASE || "https://proto-streaming-server.onrender.com";
const API_ENDPOINT = `${API_BASE}/api/streams`;
const FALLBACK_SOURCE = "/streams.json";

export function useStreamData() {
  const [streams, setStreams] = useState<StreamSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try API endpoint first, fallback to static file
      let response: Response;
      try {
        response = await fetch(API_ENDPOINT, { 
          cache: "no-cache",
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
      } catch (apiError) {
        // Fallback to static file if API is unavailable
        console.warn('API unavailable, using fallback:', apiError);
        response = await fetch(FALLBACK_SOURCE, { cache: "no-cache" });
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
      }
      
      const payload = (await response.json()) as StreamSource[];
      setStreams(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error('Error fetching streams:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  return { streams, loading, error, reload: fetchStreams };
}




