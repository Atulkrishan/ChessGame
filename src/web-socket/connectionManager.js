import { decodeFrame, encodeFrame, OPCODES } from "./frame.js";
import { handleMessage } from "./messageHandler.js";


const rooms = new Map(); 

export async function handleConnection(socket, req) {
    console.log("New WebSocket connection");

    socket.on("data", async (buffer) => {
        try {
            const { opcode, payload } = decodeFrame(buffer);

            if (opcode === OPCODES.CLOSE) {
                socket.end();
                return;
            }

            if (opcode === OPCODES.PING) {
                socket.write(encodeFrame("", OPCODES.PONG));
                return;
            }

            if (opcode === OPCODES.TEXT) {
                const message = payload.toString("utf-8");
                await handleMessage(socket, message, rooms);
            }
        } catch (error) {
            console.error("Failed to process frame:", error);
        }
    });

    socket.on("close", () => {
        removeFromAllRooms(socket);
        console.log("WebSocket connection closed");
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
        removeFromAllRooms(socket);
    });
}

export function joinRoom(gameId, socket) {
    if (!rooms.has(gameId)) {
        rooms.set(gameId, new Set());
    }
    rooms.get(gameId).add(socket);
}

export function broadcastToRoom(gameId, data, excludeSocket = null) {
    const room = rooms.get(gameId);
    if (!room) return;

    const frame = encodeFrame(JSON.stringify(data));

    for (const client of room) {
        if (client !== excludeSocket && !client.destroyed) {
            client.write(frame);
        }
    }
}

function removeFromAllRooms(socket) {
    for (const [gameId, sockets] of rooms.entries()) {
        sockets.delete(socket);
        if (sockets.size === 0) {
            rooms.delete(gameId);
        }
    }
}


export function closeRoom(gameId) {
    const room = rooms.get(gameId);

    if (!room) {
        return;
    }

    for (const socket of room) {
        if (!socket.destroyed) {
            socket.end();
        }
    }

    rooms.delete(gameId);
}