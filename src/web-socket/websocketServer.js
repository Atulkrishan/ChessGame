import crypto from "node:crypto";
import { handleConnection } from "./connectionManager.js";


const WS_MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

function generateAcceptKey(clientKey) {
    return crypto
        .createHash("sha1")
        .update(clientKey + WS_MAGIC_STRING)
        .digest("base64");
}


export function setupWebSocketServer(httpServer) {
    httpServer.on("upgrade", (req, socket, head) => {
        const clientKey = req.headers["sec-websocket-key"];

        if (!clientKey) {
            socket.destroy();
            return;
        }

        const acceptKey = generateAcceptKey(clientKey);

        const responseHeaders = [
            "HTTP/1.1 101 Switching Protocols",
            "Upgrade: websocket",
            "Connection: Upgrade",
            `Sec-WebSocket-Accept: ${acceptKey}`,
            "",
            ""
        ].join("\r\n");

        socket.write(responseHeaders);

        
        handleConnection(socket, req);
    });
}