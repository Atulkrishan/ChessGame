import { hexToInt, intToHex } from "./board.js";

function getAllPawnMoves(pos,turn){
    let options = [-1,0,1];
    let row = hexToInt(pos).row;
    let col = hexToInt(pos).col;

    let moves = [];

    for(let i = 0 ; i < options.length ; i++){
        let nrow = row + ((turn == "W") ? -1 : 1);
        let ncol = col + options[i];

        if(ncol >= 0 && ncol < 8 && nrow >= 0 && nrow < 8){
            const hexPos = intToHex({
                "row" : nrow,
                "col" : ncol
            });

            moves.push({
                "hexPos" : hexPos,
                "type" : options[i] == 0 ? "N1" : "S",
            });
        }
    }
    
    let spInMoveRow = row + ((turn == "W") ? -2 : 2);
    let spInMoveCol = col;

    if(spInMoveRow >= 0 && spInMoveRow < 8 && spInMoveCol >= 0 && spInMoveCol < 8){
        const hexPos = intToHex({
            "row" : spInMoveRow,
            "col" : spInMoveCol
        });
        moves.push({
            "hexPos" : hexPos,
            "type" : "N2"
        });
    }

    return moves;
}

function getAllBishopMoves(pos){
    let {row, col} = hexToInt(pos);

    let x = row;
    let y = col;
    let moves = [];

    while(x - 1 >= 0 && y - 1 >= 0){
        moves.push(intToHex({
            "row" : x - 1,
            "col" : y - 1
        }))
        x--;
        y--;
    }
    x = row;
    y = col;
    while(x - 1 >= 0 && y + 1 < 8){
        moves.push(intToHex({
            "row" : x - 1,
            "col" : y + 1
        }))
        x--;
        y++;
    }
    x = row;
    y = col;
    while(x + 1 < 8 && y + 1 < 8){
        moves.push(intToHex({
            "row" : x + 1,
            "col" : y + 1
        }))
        x++;
        y++;
    }
    x = row;
    y = col;
    while(x + 1 < 8 && y - 1 >= 0){
        moves.push(intToHex({
            "row" : x + 1,
            "col" : y - 1
        }))
        x++;
        y--;
    }

    return moves;
}

function getAllRookMoves(pos){
    let {row, col} = hexToInt(pos);

    let x = row;
    let y = col;
    let moves = [];

    while(x - 1 >= 0){
        moves.push(intToHex({
            "row" : x - 1,
            "col" : y
        }))
        x--;
    }
    x = row;
    y = col;
    while(y + 1 < 8){
        moves.push(intToHex({
            "row" : x,
            "col" : y + 1
        }))
        y++;
    }
    x = row;
    y = col;
    while(x + 1 < 8){
        moves.push(intToHex({
            "row" : x + 1,
            "col" : y,
        }))
        x++;
    }
    x = row;
    y = col;
    while(y - 1 >= 0){
        moves.push(intToHex({
            "row" : x,
            "col" : y - 1
        }))
        y--;
    }

    return moves;
}

function getAllQueenMoves(pos){
    return [...getAllBishopMoves(pos),...getAllRookMoves(pos)];
}

function getAllKnightMoves(pos){
    let options = [[2,-1],[2,1],[1,2],[-1,2],[1,-2],[-1,-2],[-2,-1],[-2,1]];
    let moves = [];

    for(let i = 0; i < 8 ; i++){
        let nx = hexToInt(pos).row + options[i][0];
        let ny = hexToInt(pos).col + options[i][1];

        if(nx >= 0 && ny >= 0 && nx < 8 && ny < 8){
            moves.push(intToHex({
                "row" : nx,
                "col" : ny
            }))
        }
    }
    return moves;

}

function getAllKingMoves(pos,turn){
    let options = [[0,-1],[0,1],[1,0],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]];
    let moves = [];

    for(let i = 0; i < 8 ; i++){
        let nx = hexToInt(pos).row + options[i][0];
        let ny = hexToInt(pos).col + options[i][1];

        if(nx >= 0 && ny >= 0 && nx < 8 && ny < 8){
            moves.push({
                "hexPos" : intToHex({"row" : nx, "col" : ny}),
                "type" : "N"
            })
        }
    }    
    let nx = hexToInt(pos).row ;
    let ny1 = hexToInt(pos).col - 2;

    if(nx >= 0 && ny1 >= 0 && nx < 8 && ny1 < 8){
        moves.push({
            "hexPos" : intToHex({"row" : nx, "col" : ny1}),
            "type" : (turn == "W") ? "CL" : "CR"
        })
    }

    let ny2 = hexToInt(pos).col + 2;

    if(nx >= 0 && ny2 >= 0 && nx < 8 && ny2 < 8){
        moves.push({
            "hexPos" : intToHex({"row" : nx, "col" : ny2}),
            "type" : (turn == "W") ? "CR" : "CL"
        })
    }

    return moves;

}

export {getAllBishopMoves , getAllKingMoves , getAllKnightMoves , getAllPawnMoves , getAllQueenMoves,getAllRookMoves}
 
