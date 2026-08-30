import { encodeFrame } from "./frame.js";

import { joinRoom, broadcastToRoom, closeRoom} from "./connectionManager.js";

import { findMatch } from "../game/matchmaking.js";

import * as GameAdapter from "../game/game-adapter.js";


export async function handleMessage(socket, rawMessage, rooms) {

    let message;

    try {
        message = JSON.parse(rawMessage);
    } catch {
        socket.write(
            encodeFrame(
                JSON.stringify({
                    type: "error",
                    error: "Invalid JSON message"
                })
            )
        );

        return;
    }

    const { type, gameId } = message;

    switch (type) {

        case "find_match": {

            const match = findMatch({
                socket
            });

            // Nobody available yet
            if (!match.matched) {

                socket.write(
                    encodeFrame(
                        JSON.stringify({
                            type: "waiting",
                            message: "Waiting for opponent"
                        })
                    )
                );

                break;
            }

            // Two players matched
            const game = await GameAdapter.createGame();

            if (!game.success) {

                socket.write(
                    encodeFrame(
                        JSON.stringify({
                            type: "error",
                            error: game.error
                        })
                    )
                );

                break;
            }

            const newGameId = game.gameId;

            const player1 = match.player1.socket;
            const player2 = match.player2.socket;

            // Put both players into the same room
            joinRoom(newGameId, player1);
            joinRoom(newGameId, player2);

            // Store game information on sockets
            player1.gameId = newGameId;
            player2.gameId = newGameId;

            player1.color = "W";
            player2.color = "B";

            // Tell player 1
            player1.write(
                encodeFrame(
                    JSON.stringify({
                        type: "game_start",
                        gameId: newGameId,
                        color: "W"
                    })
                )
            );

            // Tell player 2
            player2.write(
                encodeFrame(
                    JSON.stringify({
                        type: "game_start",
                        gameId: newGameId,
                        color: "B"
                    })
                )
            );

            break;
        }


        case "move": {

            if (!socket.gameId) {
                socket.write(
                    encodeFrame(
                        JSON.stringify({
                            type: "error",
                            error: "You are not in a game"
                        })
                    )
                );
                break;
            }

            const result = await GameAdapter.makeMove(
                socket.gameId,
                message.move
            );

            // Invalid move
            if (!result.success) {
                socket.write(
                    encodeFrame(
                        JSON.stringify({
                            type: "invalid_move",
                            error: result.error,
                            state: result.state
                        })
                    )
                );
                break;
            }

            /*
                result.moveResult:

                2  = normal move
                5  = capture
                10 = checkmate
                1  = stalemate
            */

            // CHECKMATE
            if (result.moveResult === 10) {

                broadcastToRoom(socket.gameId, {
                    type: "game_over",
                    move: message.move,
                    state: result.state,
                    result: "checkmate",
                    gameResult: result.gameResult,
                    winnerId: result.winnerId
                });

                const gameId = socket.gameId;

                // Close both players
                setTimeout(() => {
                    closeRoom(gameId);
                    GameAdapter.deleteGame(gameId);
                }, 100);

                break;
            }

            // STALEMATE
            if (result.moveResult === 1) {

                broadcastToRoom(socket.gameId, {
                    type: "game_over",
                    move: message.move,
                    state: result.state,
                    result: "stalemate",
                    gameResult: result.gameResult,
                    winnerId: null
                });

                const gameId = socket.gameId;

                setTimeout(() => {
                    closeRoom(gameId);
                    GameAdapter.deleteGame(gameId);
                }, 100);

                break;
            }

            // NORMAL MOVE OR CAPTURE
            if (
                result.moveResult === 2 ||
                result.moveResult === 5
            ) {

                broadcastToRoom(socket.gameId, {
                    type: "move",
                    move: message.move,
                    state: result.state,
                    result: result.moveResult
                });

                break;
            }

            break;
        }

        case "resign": {

            if (!socket.gameId) {
                socket.write(
                    encodeFrame(
                        JSON.stringify({
                            type: "error",
                            error: "You are not in a game"
                        })
                    )
                );
                break;
            }

            const result = await GameAdapter.resignGame(
                socket.gameId,
                socket.userId
            );

            if (!result.success) {
                socket.write(
                    encodeFrame(
                        JSON.stringify({
                            type: "error",
                            error: result.error
                        })
                    )
                );
                break;
            }

            broadcastToRoom(socket.gameId, {
                type: "game_over",
                result: result.result,
                winnerId: result.winnerId,
                reason: "resignation"
            });

            break;
        }

        default:

            socket.write(
                encodeFrame(
                    JSON.stringify({
                        type: "error",
                        error: `Unknown message type: ${type}`
                    })
                )
            );
    }
}