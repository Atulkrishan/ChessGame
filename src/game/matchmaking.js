let waitingPlayer = null;

export function findMatch(player) {

    if (!waitingPlayer) {

        waitingPlayer = player;

        return {
            matched: false
        };
    }

    const opponent = waitingPlayer;

    waitingPlayer = null;

    return {
        matched: true,
        player1: opponent,
        player2: player
    };
}