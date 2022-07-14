const Gameboard = ( () => {
    let board = new Array(9);
    const writeAndSwitch = (tile,playerA,playerB) => {
        let tileId = tile.id;
        let tileNumber = tileId.split('')[1];
        board[tileNumber] = playerA.mark;
        tile.textContent = playerA.mark;
        playerA.active = false;
        playerB.active = true;
    };

    const cpuWriteAndSwitch = (chsTile,playerA,playerB) => {
        tiles.forEach(tile => {
            if (tile.id.split("")[1] == chsTile){
                tile.textContent = playerA.mark;
                board[chsTile] = playerA.mark;
                playerA.active = false;
                playerB.active = true;
            }
        });
        
    }

    let emptyTiles
    let randomTile 

    const cpuRandomMove = () =>{
        let emptyTiles = getEmptyElem(board);
        let randomTile = chooseRandomTile(emptyTiles);
        cpuWriteAndSwitch(randomTile,playerTwo,playerOne);
        GameResults.checkRes(board)
    }

    const cpuBossMove = (board) => {
        let newBoard = [...board]
        let bestMove = AiPlayer.minimax(newBoard,playerTwo)
        cpuWriteAndSwitch(bestMove.index,playerTwo,playerOne);
        GameResults.checkRes(board)
    }
 
    const populate = (player1,player2) => {
    
        if (playerTwo.human == true) {
            tiles = document.querySelectorAll(".tile");
            tiles.forEach(tile => {
                tile.addEventListener("click", () => {
                    if (tile.textContent == ''){
                        if (player1.active == true){
                            writeAndSwitch(tile,player1,player2);
                            GameResults.checkRes(board)
                        } else if(player2.active == true && player2.human == true) {
                            writeAndSwitch(tile,player2,player1);
                            GameResults.checkRes(board)
                        }                         
                    } 
                })
            }
            )
        } else if(playerTwo.human == false){
            tiles.forEach(tile => {
                tile.addEventListener("click", () => {
                    if (tile.textContent == ''){
                        writeAndSwitch(tile,player1,player2);
                        GameResults.checkRes(board)
                        if (ai == false){
                            setTimeout(cpuRandomMove,600);
                        } else if(ai == true){
                            setTimeout(cpuBossMove(board),600);
                        }
                    }   
            })
            }) 
        }

    };

    const getEmptyElem = (board) => {
        let emptyIdx = [];
        for(let i = 0; i < board.length; i++){
            if(board[i]==undefined){
                emptyIdx.push(i)
            }
        }
        return emptyIdx
    };

    const chooseRandomTile = (array) => {
        let tl = Math.floor(Math.random() * array.length);
        return array[tl]
    }

    const restart = () => {
        tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => {
            tile.textContent = ""
        })
        playerOne.active = true;
        playerTwo.active = false;
        emptyTiles = [];
        board = new Array(9);   
        GameLogic.play(playerOne,playerTwo)     
    }
    return {board,populate,getEmptyElem,restart}
})()

const Player = (name,mark,active,human) => {
    return {name,mark,active,human};
};

const GameLogic = ( () => {

    const humanPlay = () => {
        playButton.addEventListener("click", () => {
            playerOne.name = document.getElementById("X-name").value;
            playerTwo.name = document.getElementById("O-name").value;
            humanModal.classList.remove("showing"); 
            play(playerOne,playerTwo)
        })
    }


    const cpuDifficultySetting = () => {
        cpuCpuSel.forEach(button => {
            button.addEventListener("click", ()=> {
                if (button.id == "random"){
                    ai = false;
                    cpuDiffModal.classList.remove("showing");
                    play(playerOne,playerTwo);
                } else if(button.id == "impossible"){
                    ai = true;
                    cpuDiffModal.classList.remove("showing");
                    play(playerOne,playerTwo);
                }
            })
        })
        
    }

    const gameSelection = () => {
        cpuHumanSel.forEach(button => {
            button.addEventListener("click", () => {
                if (button.id == "cpu") {
                    cpuHumanModal.classList.remove("showing");  
                    cpuDiffModal.classList.add("showing");
                    playerTwo.human = false;  
                    cpuDifficultySetting()            
                } else if (button.id == "human") {
                    cpuHumanModal.classList.remove("showing");
                    humanModal.classList.add("showing")
                    playerTwo.human = true;
                    humanPlay()
                }
            })
        })
    }

    const play = (player1,player2) => {
        Gameboard.populate(player1,player2)
        restartButton.addEventListener("click", Gameboard.restart)  
    }

    const game = (player1,player2) => {
        gameSelection();
        play(player1,player2)
    }
    return {play,game}
})()

const GameResults = ( (board) => {
    const checkRow = (board) => {
        let row = []
        for(let i = 0; i<9; i+=3){
            row = board.slice(i,i+3);
            if (row.join("") == "XXX" || row.join("") == "OOO"){
                let win = true, winMrk = row.join("")[0];
                return {win,winMrk}
            } 
        } 
    }
    
    const checkCol = (board) => {
        let col = [];
        for(let i  = 0; i<3; i++){
            col = [board[i],board[i+3],board[i+6]];
            if (col.join("") == "XXX" || col.join("") == "OOO"){
                let win = true, winMrk = col.join("")[0];
                return {win,winMrk}
            }  
        }
    }

    const checkDiag = (board) => {
        let diag1 = [board[0],board[4],board[8]];
        let diag2 = [board[2],board[4],board[6]];
        if (diag1.join("") == "XXX" || diag1.join("") == "OOO"){
            let win = true, winMrk = diag1.join("")[0];
            return {win,winMrk}
        } else if (diag2.join("") == "XXX" || diag2.join("") == "OOO"){
            let win = true, winMrk = diag2.join("")[0];
            return {win,winMrk}
        }
    }

    const checkDraw = (board) => {
        if(board.length == board.join("").length){
            let draw = true;
            return draw;
        }
    }

    const generalWin = (board) => {
        rowRes = checkRow(board);
        colRes = checkCol(board);
        diagRes = checkDiag(board);
        if (rowRes != undefined && rowRes.win){
            return {w:true,m:rowRes.winMrk}    
        } else if(colRes != undefined && colRes.win ){
            return {w:true,m:colRes.winMrk} 
        } else if(diagRes != undefined && diagRes.win){
            return {w:true,m:diagRes.winMrk}   
        } else {
            return false;
        } 
    }

    const checkRes = (board) =>{
        let rowRes = checkRow(board);
        let colRes = checkCol(board);
        let diagRes = checkDiag(board);
        let drawRes = checkDraw(board);
        if (rowRes != undefined && rowRes.win) {
            endGame(rowRes.winMrk)
        } else if (colRes != undefined && colRes.win) {
            endGame(colRes.winMrk)
        } else if (diagRes != undefined && diagRes.win) {
            endGame(diagRes.winMrk)
        } else if (drawRes){
            mrk = undefined;
            endGame(mrk)
        }
    }

    const endGame = (mrk) => {
        if (mrk == playerOne.mark){
            greetings.textContent = `${playerOne.name} WON!`
        } else if (mrk == playerTwo.mark){
            greetings.textContent = `${playerTwo.name} WON!`
        } else {
            greetings.textContent = "It's a draw!"
        }
        endGameModal.classList.add("showing");
        playAgain.addEventListener("click",() => {
            rowRes = undefined, colRes = undefined, diagRes = undefined, drawRes = undefined;
            Gameboard.restart() 
            endGameModal.classList.remove("showing");  
            
        }) 
    }
    return {checkRes,generalWin}
}
)()

const AiPlayer = ( () => {
    const minimax = (newBoard,player) => {

        let emptySpots = Gameboard.getEmptyElem(newBoard);
        res = GameResults.generalWin(newBoard) 
        if (res.w && res.m == "X") {
            return {score: -10};
        } else if(res.w && res.m == "O") {
            return {score: 10};
        } else if (emptySpots.length == 0){
            return {score: 0};
        }
        let moves = [];
        for (let i = 0; i < emptySpots.length ;i++){
            let move ={};
            move.index = emptySpots[i];
            newBoard[emptySpots[i]] = player.mark;     
            if (player == playerTwo){
                let result = minimax(newBoard,playerOne)
                move.score = result.score;
            } else {
                let result = minimax(newBoard,playerTwo)
                move.score = result.score;
            }
            newBoard[emptySpots[i]] = undefined;
            moves.push(move)
        }
        let bestMove;
        if (player == playerTwo){
            let bestScore = -10000;
            for(let i = 0; i< moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000; 
            for( let i = 0; i < moves.length; i++){
                if (moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i
                }
            }
        }
        return moves[bestMove];

    }
    return {minimax}
})()


const boardContainer = document.querySelector(".board-container");
let tiles = document.querySelectorAll(".tile");
const restartButton = document.querySelector(".restart-button");
const endGameModal = document.querySelector(".end-game-modal");
const playAgain = document.querySelector(".play-again");
const greetings = document.querySelector(".greetings");
const humanModal = document.querySelector(".human-name-modal");
const playButton = document.querySelector(".play-button");
const cpuHumanSel = document.querySelectorAll(".pl-cpu");
const cpuHumanModal = document.querySelector(".human-cpu-modal");
const cpuDiffModal = document.querySelector(".cpu-diff-modal");
const cpuCpuSel = document.querySelectorAll(".difficulty");

const playerOne = Player('You','X',true,true)
const playerTwo = Player('The AI','O',false)

let ai

GameLogic.game(playerOne,playerTwo)


