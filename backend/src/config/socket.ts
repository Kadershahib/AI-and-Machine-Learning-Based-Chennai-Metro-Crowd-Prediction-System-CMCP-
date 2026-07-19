import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server;

export function initSocket(server: HTTPServer): Server {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[socket] client connected: ${socket.id}`);

    socket.on("subscribe:station", (stationId: string) => {
      socket.join(`station:${stationId}`);
    });

    socket.on("unsubscribe:station", (stationId: string) => {
      socket.leave(`station:${stationId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[socket] client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error("Socket.IO not initialized. Call initSocket first.");
  return io;
}
