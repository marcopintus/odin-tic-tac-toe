const Gameboard = ( () => {
    const gameboard = ['X','O','X','O','X','O','O','X','X'];
    const add = (a, b) => a + b;
    const populateAll = () => {
        for(let i = 0; i<9; i++){
            tiles[i].textContent = gameboard[i];
        }
    };
    const populate = (player1,player2) => {
        tiles.forEach(tile => {
            tile.addEventListener("click", () => {
                if (tile.textContent == '' && player1.active == true){
                    tile.textContent = player1.mark;
                    player1.active = false;
                    player2.active = true;
                } else if (tile.textContent == '' && player2.active == true){
                    tile.textContent = player2.mark;
                    player2.active = false;
                    player1.active = true;
                }
            })
        })
    }
    return {add,populateAll,populate}
})()

const Player = (name,mark,active) => {

    return {name,mark,active};
};

const GameLogic = ( () => {
    const turns = (player1,player2) => {
        Gameboard.populate(player1,player2)
    }
    
    return {turns}
})()

const ResultChecker = ( () => {
    // not working
    const checkColumn = (colClass) => {
        let col = document.querySelectorAll(colClass);
        let check = [];
        col.forEach(tile => {
            check.push(tile.textContent);
        })
        if(check[0] == check[1] == check[2] && check[0] != ''){
            console.log("WON")
        }
    }
    const checkAllCols = () => {
        const colClasses = [".one",".two",".three"];
        for(let i = 0; i< 3;i++){
            
            checkColumn(colClasses[i]);
        }
    }
    return {checkColumn,checkAllCols}
}
)()

const boardContainer = document.querySelector(".board-container");
const tiles = document.querySelectorAll(".tile");

const playerOne = Player('One','X',true)
const playerTwo = Player('Two','O',false)

GameLogic.turns(playerOne,playerTwo)
ResultChecker.checkAllCols()
