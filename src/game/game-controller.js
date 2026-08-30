import { readGames, writeGames } from "../storage/game-store.js";
import { sendJSON } from "../utils/api-response.js";


export async function getGame(req, res) {
    const { gameId } = req.params;

    const games = await readGames();

    const game = games.find(
        game => game.id === gameId
    );

    if (!game) {
        return sendJSON(res, 404, {
            success: false,
            message: "Game not found"
        });
    }

    return sendJSON(res, 200, {
        success: true,
        message: "Game fetched successfully",
        data: game
    });
}

export async function getGames(req, res) {
    const games = await readGames();

    return sendJSON(res, 200, {
        success: true,
        message: "Games fetched successfully",
        data: games
    });
}