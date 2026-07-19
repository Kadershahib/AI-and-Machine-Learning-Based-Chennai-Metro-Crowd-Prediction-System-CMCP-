import "dotenv/config";
import http from "http";
import app from "./app";
import { initSocket } from "./config/socket";
import { startLiveUpdateCron } from "./jobs/liveUpdateCron";

const PORT = process.env.PORT || 4000;

// Safety net: never let an unexpected error crash the whole server during a demo.
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
});

const server = http.createServer(app);
initSocket(server);
startLiveUpdateCron();

server.listen(PORT, () => {
  console.log(`🚇 CMCP backend running on http://localhost:${PORT}`);
});