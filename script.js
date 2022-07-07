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
        let emptyTiles = getEmptyElem();
        let randomTile = chooseRandomTile(emptyTiles);
        cpuWriteAndSwitch(randomTile,playerTwo,playerOne);
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
                        setTimeout(cpuRandomMove,600);
                    }
                        
            })
            }) 
        }

    };

    const getEmptyElem = () => {
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
        
        play(playerOne,playerTwo)
    }

    const gameSelection = () => {
        cpuHumanSel.forEach(button => {
            button.addEventListener("click", () => {
                if (button.id == "cpu") {
                    cpuHumanModal.classList.remove("showing");   
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
                console.log("Row: WON", row.join("")[0])
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
                console.log("Col: WON", col.join("")[0])
                let win = true, winMrk = col.join("")[0];
                return {win,winMrk}
            }  
        }
    }

    const checkDiag = (board) => {
        let diag1 = [board[0],board[4],board[8]];
        let diag2 = [board[2],board[4],board[6]];
        if (diag1.join("") == "XXX" || diag1.join("") == "OOO"){
            console.log("Diag1: WON" , diag1.join("")[0])
            let win = true, winMrk = diag1.join("")[0];
            return {win,winMrk}
        } else if (diag2.join("") == "XXX" || diag2.join("") == "OOO"){
            console.log("Diag2: WON",diag2.join("")[0])
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

    const checkRes = (board) =>{
        let rowRes = checkRow(board);
        let colRes = checkCol(board);
        let diagRes = checkDiag(board);
        let drawRes = checkDraw(board);
        if (rowRes != undefined && rowRes.win) {
            console.log("winner:",rowRes.winMrk)
            endGame(rowRes.winMrk)
        } else if (colRes != undefined && colRes.win) {
            console.log("winner:",colRes.winMrk)
            endGame(colRes.winMrk)
        } else if (diagRes != undefined && diagRes.win) {
            console.log("winner:",diagRes.winMrk)
            endGame(diagRes.winMrk)
        } else if (drawRes){
            mrk = undefined;
            endGame(mrk)
            console.log("REAL DRAW")
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
    return {checkRes}
}
)()


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

const playerOne = Player('You','X',true,true)
const playerTwo = Player('The AI','O',false)

GameLogic.game(playerOne,playerTwo)


