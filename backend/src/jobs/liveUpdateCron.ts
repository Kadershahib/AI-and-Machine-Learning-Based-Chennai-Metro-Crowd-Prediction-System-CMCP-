import { getIO } from "../config/socket";
import { generateLiveSnapshot } from "../services/simulationService";

const INTERVAL_MS = 15000; // push a simulated "live" update every 15s

export function startLiveUpdateCron() {
  setInterval(async () => {
    try {
      const snapshot = await generateLiveSnapshot();
      getIO().emit("crowd:update", snapshot);
    } catch (err) {
      console.error("[liveUpdateCron] failed to generate snapshot:", (err as Error).message);
    }
  }, INTERVAL_MS);

  console.log(`[liveUpdateCron] started, interval=${INTERVAL_MS}ms`);
}
