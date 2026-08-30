import { getInitialPiecePostiton } from "./board.js";
import { hexToInt, intToHex ,isLastRow ,getLastPieceOnBoard} from "./board.js";
import {getAllBishopMoves , getAllKingMoves , getAllKnightMoves , getAllPawnMoves , getAllQueenMoves,getAllRookMoves} from "./pieces.js";

function checkDiagPath(positions , from , to){
    let {row : a , col : b} = hexToInt(from);
    let {row : x , col : y} = hexToInt(to);

    if(Math.abs(a - x) !== Math.abs(b-y)) return false;

    let incA = 1, incB = 1;
    if(a > x) incA = -1;
    if(b > y) incB = -1;

    while(a + incA != x && b + incB != y){
        let na = a + incA;
        let nb = b + incB;

        let hexPos = intToHex({
            "row" : na,
            "col" : nb
        });

        if(positions[hexPos] !== '---') return false;

        a = na;
        b = nb;
    }

    return true;
}

function checkStraightPath(positions,from ,to){
    // console.log(from,to);
    
    let {row : a , col : b} = hexToInt(from);
    let {row : x , col : y} = hexToInt(to);

    if(Math.abs(a - x) != 0 && Math.abs(b-y) != 0) return false;

    let incA = 1, incB = 1;
    if(a == x) {
        if(b > y) incB = -1;

        while(b + incB != y){
            let na = a;
            let nb = b + incB;

            let hexPos = intToHex({
                "row" : na,
                "col" : nb
            });

            if(positions[hexPos] !== '---') return false;

            b = nb;
        }

    }
    else{
        if(a > x) incA = -1;

        while(a + incA != x){
            let na = a + incA;
            let nb = b;

            let hexPos = intToHex({
                "row" : na,
                "col" : nb
            });

            if(positions[hexPos] !== '---') return false;

            a = na;
        }
    }

    return true;
}

function isValidMove(chess,from,to){

    if(chess.selectedPiece[0] != chess.turn) return false; // turn validation
    if(chess.positions[to][0] === chess.turn) return false;  // to postion is blocked by one of our piece itself

    if(chess.selectedPiece[1] == "P"){

        const allMoves = getAllPawnMoves(from,chess.turn);

        const getmove = allMoves.find((move) => (move.hexPos == to));

        if(!getmove) return false;

        if(getmove.type === "N1"){
            if(chess.positions[to] !== '---') return false;

            if(isLastRow(to,chess.turn)){
                let next = getLastPieceOnBoard(`${chess.promotedPiece}`,chess.positions) + 1;
                let updatedPiece = `${chess.promotedPiece}${next}`;
                chess.positions[from] = updatedPiece;
                chess.markPromotedPiece("");
            }

            return true;
        }
        else if(getmove.type === "N2"){
            let currentPos = from;
            let initialPos = getInitialPiecePostiton(chess.selectedPiece);

            if(currentPos != initialPos) return false;

            let stepOneRow = (hexToInt(from).row + ((chess.turn == 'W') ? -1 : 1));
            let stepOneCol = hexToInt(from).col;

            let stepOne = intToHex({
                "row" : stepOneRow,
                "col" : stepOneCol,
            });

            if(chess.positions[stepOne] !== '---') return false;
            if(chess.positions[to] !== '---') return false;

            return true;
        }
        else {
            let opp = ((chess.turn === "W") ? "B" : "W"); 
            if(chess.positions[to][0] !== opp) return false;

            if(isLastRow(to,chess.turn)){
                let next = getLastPieceOnBoard(`${chess.promotedPiece}`,chess.positions) + 1;
                let updatedPiece = `${chess.promotedPiece}${next}`;
                chess.positions[from] = updatedPiece;
                chess.markPromotedPiece("");
            }

            return true;
        }
    }
    else if(chess.selectedPiece[1] == "B"){
        let allMoves = getAllBishopMoves(from);
        const getmove = allMoves.find((move) => (move === to));

        if(!getmove) return false;
        
        if(!checkDiagPath(chess.positions,from,to)) return false;

        return true;
    }
    else if(chess.selectedPiece[1] == "R"){
        let allMoves = getAllRookMoves(from);
        const getmove = allMoves.find((move) => (move === to));

        if(!getmove) return false;

        if(!checkStraightPath(chess.positions,from,to)) return false;

        return true;
    }
    else if(chess.selectedPiece[1] == "Q"){
        let allMoves = getAllQueenMoves(from);

        const getmove = allMoves.find((move) => (move === to));

        if(!getmove) return false;

        if(hexToInt(from).row == hexToInt(to).row || hexToInt(from).col == hexToInt(to).col){
            if(!checkStraightPath(chess.positions,from,to)) return false;
        }
        else {
            if(!checkDiagPath(chess.positions,from,to)) return false;
        }
        return true;
    }
    else if(chess.selectedPiece[1] == "N"){
        let allMoves = getAllKnightMoves(from);
        const getmove = allMoves.find((move) => (move === to));

        if(!getmove) return false;

        return true;
    }
    else if(chess.selectedPiece[1] == "K"){
        let allMoves = getAllKingMoves(from,chess.turn);
        const getmove = allMoves.find((move) => (move.hexPos === to));

        if(!getmove) return false;

        if(getmove.type == "N"){
            return true;
        }
        else {
            if(getInitialPiecePostiton(chess.selectedPiece) !== from) return false;
            
            if(getmove.type == "CL") {
                
                let leftRookInPos = getInitialPiecePostiton(`${chess.turn}R1`);
                
                if(chess.getPiecePos(`${chess.turn}R1`) !== leftRookInPos) return false;
                if(!checkStraightPath(chess.positions,from,leftRookInPos)) return false;

                chess.positions[intToHex({
                    "row" : hexToInt(leftRookInPos).row,
                    "col" : hexToInt(leftRookInPos).col + ((chess.turn == 'W') ? 3 : -2)
                })] = `${chess.turn}R1`;

                chess.positions[leftRookInPos] = "---";
            }

            else if(getmove.type == "CR") {
                let rightRookInPos = getInitialPiecePostiton(`${chess.turn}R2`);

                if(chess.getPiecePos(`${chess.turn}R2`) !== rightRookInPos) return false;
                if(!checkStraightPath(chess.positions,from,rightRookInPos)) return false;

                chess.positions[intToHex({
                    "row" : hexToInt(rightRookInPos).row,
                    "col" : hexToInt(rightRookInPos).col + ((chess.turn == 'W') ? -2 : 3)
                })] = `${chess.turn}R2`;

                chess.positions[rightRookInPos] = "---";
            }

            return true;
        }
    }

    return false;
}

export {isValidMove};
