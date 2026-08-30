function createInitialBoard(){
    return [
        ['BR2','BN2','BB2','BQ1','BK1','BB1','BN1','BR1'],
        ['BP8','BP7','BP6','BP5','BP4','BP3','BP2','BP1'],
        ['---','---','---','---','---','---','---','---'],
        ['---','---','---','---','---','---','---','---'],
        ['---','---','---','---','---','---','---','---'],
        ['---','---','---','---','---','---','---','---'],
        ['WP1','WP2','WP3','WP4','WP5','WP6','WP7','WP8'],
        ['WR1','WN1','WB1','WQ1','WK1','WB2','WN2','WR2']
    ];
};

function mapPositions(board){
    let postions = {};
    for(let i = 0 ; i < board.length ; i++){
        for(let j = 0 ; j < board[0].length ; j++){
            const hexPos = intToHex({
                "row" : i,
                "col" : j
            });
            postions[hexPos] = board[i][j];
        }
    }
    return postions;
}

function hexToInt(square){
    let col = square.charCodeAt(0) - 'a'.charCodeAt(0);
    let row = 8 - (square.charCodeAt(1) - '0'.charCodeAt(0));
    
    return {
        "row" : row,
        "col" : col
    }
}

function intToHex(index){
    let col = index.col;
    let row = index.row;
    
    let square = String.fromCharCode(col + 'a'.charCodeAt(0)) + String.fromCharCode(8 - row + '0'.charCodeAt(0));
    return square;
}

function generateBoard(positions){
    let board = [
        ['BR2','BN2','BB2','BQ1','BK1','BB1','BN1','BR1'],
        ['BP8','BP7','BP6','BP5','BP4','BP3','BP2','BP1'],
        ['---','---','---','---','---','---','---','---'],
        ['---','---','---','---','---','---','---','---'],
        ['---','---','---','---','---','---','---','---'],
        ['---','---','---','---','---','---','---','---'],
        ['WP1','WP2','WP3','WP4','WP5','WP6','WP7','WP8'],
        ['WR1','WN1','WB1','WQ1','WK1','WB2','WN2','WR2']
    ]
    for(let key in positions){
        board[hexToInt(key).row][hexToInt(key).col] = positions[key];
    }

    return board;
}

function isLastRow(pos , turn){
    return (pos[1] == ((turn == "W") ? 8 : 1));
}

function getLastPieceOnBoard(type,positions){
    let cnt = [0,0,0,0,0,0,0,0,0,0];

    for(let key in positions){
        if(positions[key].substr(0,2) == type){
            cnt[Number(positions[key].substr(2,1)) - 1] = 1;
        }
    }

    for(let i = 0; i < cnt.length ; i++){
        if(cnt[i]){
            return i + 1;
        }
    }
    
    return 10;
}

const initialPositions = mapPositions(createInitialBoard());

function getInitialPiecePostiton(piece){
    for(let key in initialPositions){
        if(initialPositions[key] == piece){
            return key;
        }
    }
    return "";
}

export {createInitialBoard,generateBoard,mapPositions,getInitialPiecePostiton,intToHex,hexToInt,isLastRow,getLastPieceOnBoard};
