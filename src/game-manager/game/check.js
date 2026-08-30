import { getAllKingMoves , getAllBishopMoves , getAllKnightMoves , getAllQueenMoves, getAllPawnMoves, getAllRookMoves } from "./pieces.js";
import { isValidMove } from "./validateMoves.js";

function isKingUnderCheck(chess){
    let opp = chess.turn == "W" ? "B" : "W";
    let me = chess.turn;

    let crrPiece = chess.selectedPiece;
    let myKingPos = chess.getPiecePos(`${me}K1`);

    for(let key in chess.positions){
        if(chess.positions[key][0] == opp){
            chess.turn = opp;
            chess.selectedPiece = chess.positions[key];

            if(isValidMove(chess,key,myKingPos)) {
                chess.turn = me;
                chess.selectedPiece = crrPiece;
                return true;
            }

            chess.turn = me;
            chess.selectedPiece = crrPiece;
        }
    }
    return false;
}

function isMyAllMovesFailed(chess){
    let me = chess.turn;
    
    let crrPiece = chess.selectedPiece;
    let myKingPos = chess.getPiecePos(`${me}K1`);

    for(let key in chess.positions){
        for(let i = 1 ; i <= 10 ; i++){
            if(chess.positions[key] === `${me}K1`){
                let allMoves = getAllKingMoves(key,chess.turn);

                for(let to of allMoves){
                    chess.selectedPiece = chess.positions[key];

                    if(isValidMove(chess,key,to.hexPos)){
                        
                        chess.swapPositions(key,to.hexPos);
                        chess.selectedPiece = crrPiece;

                        let tmp = chess.positions[key];

                        if(chess.positions[key] !== "---") {
                            chess.positions[key] = "---";
                        }
    
                        if(!isKingUnderCheck(chess)) {
                            chess.swapPositions(key,to.hexPos);
                            chess.positions[to.hexPos] = tmp;
                            // console.log(`${me}K${i}helps`);

                            return false;
                        }
    
                        chess.swapPositions(key,to.hexPos);
                        chess.positions[to.hexPos] = tmp;
                    }
                    chess.selectedPiece = crrPiece;
                }
                // console.log("All king moves failed");
                
            }
            else if(chess.positions[key] === `${me}N${i}`){
                let allMoves = getAllKnightMoves(key);

                for (let to of allMoves){
                    chess.selectedPiece = chess.positions[key];

                    if(isValidMove(chess,key,to)){

                        chess.swapPositions(key,to);
                        chess.selectedPiece = crrPiece;

                        let tmp = chess.positions[key];

                        if(chess.positions[key] !== "---") {
                            chess.positions[key] = "---";
                        }

                        if(!isKingUnderCheck(chess)) {
                            chess.swapPositions(key,to);
                            chess.positions[to] = tmp;
                            // console.log(`${me}N${i}helps`);

                            return false;
                        }
                        
                        chess.swapPositions(key,to);
                        chess.positions[to] = tmp;
                    }
                    chess.selectedPiece = crrPiece;
                }
                // console.log("All knight moves failed");
            }
            else if(chess.positions[key] === `${me}P${i}`){
                let allMoves = getAllPawnMoves(key,me);
                for(let to of allMoves){
                    chess.selectedPiece = chess.positions[key];
                    if(isValidMove(chess,key,to.hexPos)){
                        chess.swapPositions(key,to.hexPos);
                        chess.selectedPiece = crrPiece;

                        let tmp = chess.positions[key];

                        if(chess.positions[key] !== "---") {
                            chess.positions[key] = "---";
                        }

                        if(!isKingUnderCheck(chess)) {
                            chess.swapPositions(key,to.hexPos);
                            chess.positions[to.hexPos] = tmp;
                            // console.log(`${me}P${i}helps`);
                            return false;
                        }

                        chess.swapPositions(key,to.hexPos);
                        chess.positions[to.hexPos] = tmp;
                    }
                    chess.selectedPiece = crrPiece;
                }
                // console.log("All pawn moves failed");
            }
            else if(chess.positions[key] === `${me}Q${i}`){

                let allMoves = getAllQueenMoves(key);
                for (let to of allMoves){
                    chess.selectedPiece = chess.positions[key];
                    if(isValidMove(chess,key,to)){
                        chess.swapPositions(key,to);
                        chess.selectedPiece = crrPiece;

                        let tmp = chess.positions[key];

                        if(chess.positions[key] !== "---") {
                            chess.positions[key] = "---";
                        }

                        if(!isKingUnderCheck(chess)) {
                            chess.swapPositions(key,to);
                            chess.positions[to] = tmp;
                            // console.log(`${me}Q${i}helps`);

                            return false;
                        }
                        chess.swapPositions(key,to);
                        chess.positions[to] = tmp;
                    }
                    chess.selectedPiece = crrPiece;
                }
                // console.log("All queen moves failed");
            }
            else if(chess.positions[key] === `${me}R${i}`){
                let allMoves = getAllRookMoves(key);
                for(let to of allMoves){
                    chess.selectedPiece = chess.positions[key];
                    if(isValidMove(chess,key,to)){
                        chess.swapPositions(key,to);
                        chess.selectedPiece = crrPiece;

                        let tmp = chess.positions[key];

                        if(chess.positions[key] !== "---") {
                            chess.positions[key] = "---";
                        }

                        if(!isKingUnderCheck(chess)) {
                            chess.swapPositions(key,to);
                            chess.positions[to] = tmp;
                            // console.log(`${me}R${i}helps`);

                            return false;
                        }
                        chess.swapPositions(key,to);
                        chess.positions[to] = tmp;
                    }
                    chess.selectedPiece = crrPiece;
                }
                // console.log("All rook moves failed");

            }
            else if(chess.positions[key] === `${me}B${i}`){
                let allMoves = getAllBishopMoves(key);

                for (let to of allMoves){
                    chess.selectedPiece = chess.positions[key];
                    if(isValidMove(chess,key,to)){
                        chess.swapPositions(key,to);
                        chess.selectedPiece = crrPiece;

                        let tmp = chess.positions[key];

                        if(chess.positions[key] !== "---") {
                            chess.positions[key] = "---";
                        }

                        if(!isKingUnderCheck(chess)) {
                            chess.swapPositions(key,to);
                            chess.positions[to] = tmp;
                            // console.log(`${me}B${i}helps`);
                            return false;
                        }
                        chess.swapPositions(key,to);
                        chess.positions[to] = tmp;
                    }
                    chess.selectedPiece = crrPiece;
                }
                // console.log("All bishop moves failed");
            }
        }
    }
    return true;
}

function isCheckMate(chess){
    return isKingUnderCheck(chess) && isMyAllMovesFailed(chess);
}
function isSaleMate(chess){
    return (!isKingUnderCheck(chess) && isMyAllMovesFailed(chess));
}

export {isCheckMate , isKingUnderCheck , isSaleMate};
