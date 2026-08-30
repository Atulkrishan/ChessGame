import { isValidMove } from "./validateMoves.js";
import {mapPositions , createInitialBoard, generateBoard ,hexToInt, intToHex} from "./board.js";
import {isKingUnderCheck , isCheckMate , isSaleMate} from "./check.js";

class ChessGame{
    constructor(){
        this.positions = mapPositions(createInitialBoard());
        this.moves = [];
        this.turn = "W";
        this.firstUser = "";
        this.secondUser = "";
        this.noOfMoves = 0;
        this.result = "";
        this.startedAt = null;
        this.endedAt = null;
        this.selectedPiece = "";
        this.promotedPiece = "";
    }
    selectAPiece(piece){
        this.selectedPiece = piece;
    }

    markPromotedPiece(value){
        this.promotedPiece = value;
    }
    
    swapPositions(from,to){
        let tmp1 = this.positions[from];
        this.positions[from] = this.positions[to];
        this.positions[to] = tmp1;
    }

    makeMove(from,to){
        if(!isValidMove(this,from,to)) return -1; // Invalid Move

        // trying the move
        this.swapPositions(from,to);

        if(isKingUnderCheck(this)) {
            this.swapPositions(from,to);
            return -1; // Invalid Move
        }

        // accepting the move

        this.turn = (this.turn == "W") ? "B" : "W";
        this.noOfMoves++;
        this.moves.push({
            "piece" : this.selectedPiece,
            "from" : from,
            "to" : to
        });
        this.selectedPiece = "";
        let pieceCapturedOrNot = (this.positions[from] !== "---") ;
        this.positions[from] = "---";
        
        if(isCheckMate(this)){
            console.log("CheckMate");
            let winner = (this.turn == "W") ? "Black" : "White"; 
            this.result = `${winner} Wins`;
            return 10; // Wins
        }
        
        else if(isSaleMate(this)){
            console.log("SaleMate");
            
            this.result = `Draw By SaleMate`;
            return 1; // Draw
        }
        
        if(pieceCapturedOrNot) {
            return 5; // Opponent Piece Captured
        }

        return 2; // Free Move
    }

    getPiecePos(piece){
        for(let key in this.positions){
            if(this.positions[key] == piece){
                return key;
            }
        }
        return "#";
    }

    printBoard(){
        let board = generateBoard(this.positions);
        for(let i = 0 ; i < board.length ; i++){
            let rowString = `${8 - i} `;
            for(let j = 0; j < board.length ; j++){
                rowString += (board[i][j] + " ");
            }
            console.log(rowString);
        }
        let lastRow = "  ";
        for(let i = 0 ; i < 8 ; i++){
            lastRow += (String.fromCharCode('a'.charCodeAt(0) + i) + "   ");
        }
        console.log(lastRow);
    }
}

function newGame(){
    return new ChessGame();
}

export {newGame};
