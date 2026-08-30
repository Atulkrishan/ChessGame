import http from "node:http";
import { router } from "./http/router.js";
import { setupWebSocketServer } from "./web-socket/websocketServer.js";
import { parseJSONBody } from "./utils/body-parser.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    try {
        if (
            req.method === "POST" ||
            req.method === "PUT" ||
            req.method === "PATCH"
        ) {
            req.body = await parseJSONBody(req);
            console.log(req.body);
        } else {
            req.body = {};
        }
        await router(req, res);
    } catch (error) {
        console.error(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
    }
});

setupWebSocketServer(server);

server.listen(PORT, () => {
    console.log(`Chess server running on http://localhost:${PORT}`);
});