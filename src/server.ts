import { SERVER_CONFIG } from "./config/server.config";

import indexHtml from "../public/index.html";
import { generateUuid } from "./utils/generate-uuid";
import type { WebSocketData } from "./types";

export const createServer = () => {
  const server = Bun.serve<WebSocketData>({
    port: SERVER_CONFIG.port,
    routes: {
      "/": indexHtml,
    },
    fetch(req, server) {
      // Identify our clients
      const clientId = generateUuid();

      const updagraded = server.upgrade(req, {
        data: { clientId },
      });

      if (updagraded) {
        return undefined;
      }

      return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
      message(ws, message) {
        console.log({ message });
      }, // a message is received
      open(ws) {
        console.log(`Client ${ws.data.clientId} conected`);
      }, // a socket is opened
      close(ws, code, message) {
        console.log(`Client ${ws.data.clientId} disconected`);
      }, // a socket is closed
      drain(ws) {}, // the socket is ready to receive more data
    }, // handlers
  });

  return server;
};
