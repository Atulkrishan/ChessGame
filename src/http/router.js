import { sendJSON } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

import {
    register,
    login,
    logout,
    getMe
} from "../auth/auth-controller.js";

import {
    getGames,
    getGame
} from "../game/game-controller.js";

import { requireAuth } from "../middleware/require-auth.js";


const handleRegister = asyncHandler(register);
const handleLogin = asyncHandler(login);
const handleLogout = asyncHandler(logout);
const handleGetMe = asyncHandler(getMe);

const handleGetGames = asyncHandler(getGames);
const handleGetGame = asyncHandler(getGame);


export async function router(req, res) {

    const { method, url } = req;


    // Health check
    if (method === "GET" && url === "/health") {

        sendJSON(res, 200, {
            status: "ok",
            message: "Chess server is running"
        });

        return;
    }


    // Test route
    if (method === "GET" && url === "/api/test") {

        sendJSON(res, 200, {
            message: "Router is working"
        });

        return;
    }


    // Register
    if (method === "POST" && url === "/api/auth/register") {

        await handleRegister(req, res);

        return;
    }


    // Login
    if (method === "POST" && url === "/api/auth/login") {

        await handleLogin(req, res);

        return;
    }


    // Logout
    if (method === "POST" && url === "/api/auth/logout") {

        await handleLogout(req, res);

        return;
    }


    // Get current user
    if (method === "GET" && url === "/api/auth/me") {

        if (!requireAuth(req)) {

            sendJSON(res, 401, {
                error: "Authentication required"
            });

            return;
        }

        await handleGetMe(req, res);

        return;
    }


    // Get all games
    if (method === "GET" && url === "/api/games") {

        if (!requireAuth(req)) {

            sendJSON(res, 401, {
                error: "Authentication required"
            });

            return;
        }

        await handleGetGames(req, res);

        return;
    }


    // Get one game
    const gameMatch = url.match(/^\/api\/games\/([^/]+)$/);

    if (gameMatch && method === "GET") {

        if (!requireAuth(req)) {

            sendJSON(res, 401, {
                error: "Authentication required"
            });

            return;
        }

        const gameId = gameMatch[1];

        req.gameId = gameId;

        await handleGetGame(req, res);

        return;
    }


    // Route not found
    sendJSON(res, 404, {
        error: "Route not found"
    });
}