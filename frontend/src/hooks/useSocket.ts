import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import { LiveStationSnapshot } from "../types";
import { mockLiveSnapshot } from "../utils/mockData";

/**
 * Subscribes to live crowd updates pushed from the backend's simulation cron.
 * If the socket never connects (backend not running), falls back to a local
 * interval that regenerates mock data — so the dashboard still feels "live"
 * during offline development or a demo without the backend up.
 */
export function useLiveCrowdUpdates(intervalMs = 15000) {
  const { socket, connected } = useSocketContext();
  const [snapshot, setSnapshot] = useState<LiveStationSnapshot[]>(mockLiveSnapshot());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (!socket) return;

    const handler = (data: LiveStationSnapshot[]) => {
      setSnapshot(data);
      setLastUpdated(new Date());
    };

    socket.on("crowd:update", handler);
    return () => {
      socket.off("crowd:update", handler);
    };
  }, [socket]);

  useEffect(() => {
    if (connected) return; // real data is flowing, skip mock loop
    const id = setInterval(() => {
      setSnapshot(mockLiveSnapshot());
      setLastUpdated(new Date());
    }, intervalMs);
    return () => clearInterval(id);
  }, [connected, intervalMs]);

  return { snapshot, lastUpdated, isLive: connected };
}
