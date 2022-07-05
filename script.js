const Gameboard = ( () => {
    const board = new Array(9)
    const writeAndSwitch = (tile,playerA,playerB) => {
        let tileId = tile.id;
        let tileNumber = tileId.split('')[1];
        board[tileNumber] = playerA.mark;
        tile.textContent = playerA.mark;
        playerA.active = false;
        playerB.active = true;
    };
    const populate = (player1,player2) => {
        tiles.forEach(tile => {
            tile.addEventListener("click", () => {
                if (tile.textContent == '' && player1.active == true){
                    writeAndSwitch(tile,player1,player2);
                    GameResults.checkRes(Gameboard.board)
                } else if (tile.textContent == '' && player2.active == true){
                    writeAndSwitch(tile,player2,player1);
                    GameResults.checkRes(Gameboard.board)
                }
            })
        })
    }
    return {board,populate}
})()

const Player = (name,mark,active) => {
    return {name,mark,active};
};

const GameLogic = ( () => {
    const play = (player1,player2) => {
        Gameboard.populate(player1,player2)
    }
    return {play}
})()

const GameResults = ( (board) => {
    const checkRow = (board) => {
        let row = []
        for(let i = 0; i<9; i+=3){
            row = board.slice(i,i+3);
            if (row.join("") == "XXX" || row.join("") == "OOO"){
                console.log("Row: WON")
            }
        } 
    }
    
    const checkCol = (board) => {
        let col = [];
        for(let i  = 0; i<3; i++){
            col = [board[i],board[i+3],board[i+6]];
            if (col.join("") == "XXX" || col.join("") == "OOO"){
                console.log("Col: WON")
            }
        }
    }

    const checkDiag = (board) => {
        let diag1 = [board[0],board[4],board[8]];
        let diag2 = [board[2],board[4],board[6]];
        if (diag1.join("") == "XXX" || diag1.join("") == "OOO" || diag2.join("") == "XXX" || diag2.join("") == "OOO"){
            console.log("Diag: WON")
        } 
        
    }

    const checkRes = (board) =>{
        checkRow(board);
        checkCol(board);
        checkDiag(board);
    }
    return {checkRes}
}
)()


const boardContainer = document.querySelector(".board-container");
const tiles = document.querySelectorAll(".tile");

const playerOne = Player('One','X',true)
const playerTwo = Player('Two','O',false)

GameLogic.play(playerOne,playerTwo)


