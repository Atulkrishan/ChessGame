import { newGame } from "../game-manager/game/index.js";
import { readGames, writeGames } from "../storage/game-store.js";
import { createId } from "../utils/create-id.js";

const games = new Map();

export async function createGame(whitePlayerId, blackPlayerId) {
    try {
        const chessGame = newGame();
        const gameId = createId();

        const game = {
            id: gameId,
            whitePlayerId,
            blackPlayerId,
            status: "active",

            board: chessGame.positions,
            turn: "white",

            winnerId: null,
            result: null,
            finishedReason: null,

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Keep live chess game in memory
        games.set(gameId, chessGame);

        // Save the game object in games.json
        const savedGames = await readGames();
        savedGames.push(game);
        await writeGames(savedGames);

        return {
            success: true,
            gameId,
            state: chessGame.positions
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

export async function makeMove(gameId, move) {
    try {
        const chessGame = games.get(gameId);

        if (!chessGame) {
            return {
                success: false,
                error: "Game not found"
            };
        }

        const { piece, from, to } = move;

        if (!piece || !from || !to) {
            return {
                success: false,
                error: "Piece, from and to are required"
            };
        }

        // Verify that the piece is actually at the from position
        if (chessGame.positions[from] !== piece) {
            return {
                success: false,
                error: "Selected piece does not match board"
            };
        }

        // Set selected piece
        chessGame.selectAPiece(piece);

        console.log("MOVE RECEIVED:", move);
        console.log("SELECTED PIECE:", chessGame.selectedPiece);
        console.log("FROM:", from);
        console.log("TO:", to);
        console.log("TURN:", chessGame.turn);

        // Make chess move
        const result = chessGame.makeMove(from, to);

        console.log("GAME MAKE MOVE RESULT:", result);

        // Invalid move
        if (result === -1) {
            return {
                success: false,
                error: "Invalid move",
                state: chessGame.positions
            };
        }

        // Read saved game
        const savedGames = await readGames();

        const game = savedGames.find(
            game => game.id === gameId
        );

        let winnerId = null;

        if (game) {

            game.board = chessGame.positions;

            game.turn =
                chessGame.turn === "W"
                    ? "white"
                    : "black";

            // CHECKMATE
            if (result === 10) {

                game.status = "finished";

                game.result = chessGame.result;

                game.finishedReason = "checkmate";

                // IMPORTANT:
                // After makeMove(), turn has already changed.
                // Therefore the player whose turn it is now
                // is the player who LOST.
                //
                // So the opposite player is the winner.

                if (chessGame.turn === "W") {
                    winnerId = game.blackPlayerId;
                } else {
                    winnerId = game.whitePlayerId;
                }

                game.winnerId = winnerId;
            }

            // STALEMATE
            else if (result === 1) {

                game.status = "finished";

                game.result = chessGame.result;

                game.finishedReason = "stalemate";

                game.winnerId = null;
            }

            game.updatedAt = new Date().toISOString();

            await writeGames(savedGames);
        }

        return {
            success: true,
            moveResult: result,
            state: chessGame.positions,
            gameResult: chessGame.result,
            winnerId
        };

    } catch (error) {

        return {
            success: false,
            error: error.message
        };
    }
}


export function getGameState(gameId) {
    try {
        const chessGame = games.get(gameId);

        if (!chessGame) {
            return {
                success: false,
                error: "Game not found"
            };
        }

        return {
            success: true,
            state: chessGame.positions
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

export function deleteGame(gameId) {
    games.delete(gameId);
}

