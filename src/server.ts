import { SERVER_CONFIG } from "./config/server.config";

import indexHtml from "../public/index.html";
import { generateUuid } from "./utils/generate-uuid";
import type { WebSocketData } from "./types";
import { handleMessage } from "./handlers/message.handlers";

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
      open(ws) {
        console.log(`Client ${ws.data.clientId} conected`);
        ws.subscribe(SERVER_CONFIG.defaultChannelName);
        // Todo: Emit the current list of political parties
      },
      message(ws, message: string) {
        const response = handleMessage(message);
        const responseString = JSON.stringify(response);

        if (response.type === "ERROR") {
          ws.send(responseString);
          return;
        }

        if (response.type === "PARTIES_LIST") {
          ws.send(responseString);
          return;
        }

        ws.send(responseString);
        ws.publish(SERVER_CONFIG.defaultChannelName, responseString);
      },
      close(ws, code, message) {
        console.log(`Client ${ws.data.clientId} disconected`);
        ws.unsubscribe(SERVER_CONFIG.defaultChannelName)
      }, // a socket is closed
      drain(ws) {}, // the socket is ready to receive more data
    }, // handlers
  });

  return server;
};
