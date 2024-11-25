function Place(Piece,Move,boardplaced) { //Places a piece onto a Board
    if ( (Move < 0 || Move > 8) || boardplaced[Move] != " " || !(Piece == "X" || Piece == "O" || Piece == " ")){ //Only allow placing on empty squares within the array
      console.log("trying to place" + Move) // Error Placing
      return boardplaced
    }
    else{
    tempboard = boardplaced.slice() // Get Array by Value
    tempboard[Move] = Piece //Set Piece
    return tempboard // Return Board with tile placed
  }
}

function NextPiece(PieceBoard){ // Get which piece is next to be placed

  let num_places = 0

  for (let j = 0; j < 9 ;j++){
      if (PieceBoard[j] != " ") {
        num_places++ // Increment number of filled tiles
      }

    }

    if (num_places % 2 == 1 ){
      return "O" // If # of tiles placed is odd, next piece is O
    }
    else {
      return "X" // Even # of tiles placed
    }
}


function PossibleMove(PossibleBoard){ //Get a list of indexes for empty tiles
  PossMoves = []
  for (let k = 0; k<9; k++){
    if (PossibleBoard[k] == " "){ //If tile empty
      PossMoves.push(k) // Add index to list
    }
  }
  return PossMoves // Return array of indexes
}


function BoardScore(ScoringBoard,depth){ //Get score for Ai 
  let win = CheckWin(ScoringBoard)


  if (win == "X"){ //Player wins
    return -10 + depth //Punish AI for losing, less of a punishment for taking longer to lose
    //game will never go on for more than 9 turns, scores of 10 prevent wins and losses from giving a tie score value of 0
  }
  else if(win == "O"){ //Ai plays as "O"
    return 10 - depth //Reward AI for winning, rewarded more for winning sooner
  }
  else{
    return 0 //Tie is always preferable over losing but always worse than winning
  }
}


function Index(maxormin,arr){ //Get the index of either the Maxiumum or Minimum element
  //console.log("arr is "+arr) 
  if (maxormin == "Max"){ // If asking for max
  return arr.indexOf(Math.max(...arr))   //Return index of max element
  }
  else{                   // if not asking for max
    return arr.indexOf(Math.min(...arr)) //Return index of min element
  }
}

function AImove(AIplaceboard){ // AI decides and places piece

      let Choice = 4 // Default to placing "O" in center

      if (PossibleMove(AIplaceboard).length == 8){ //Predecided first move to prevent extreme processing

        let randindex = Math.floor(Math.random()*4) // Random Index from 0 to 3
        if(AIplaceboard[4] == "X" || AIplaceboard.indexOf("X") % 2 == 1){//X in center or on edge
          Choice = [0,2,6,8][randindex] //If X is placed in center or on edge, place "O" in corner
          } 
      }
      else{
        let AIspot = Minimax(AIplaceboard,0)[1] //Calculate the highest scores for each possible move that "O" could make, getting the index
        Choice = PossibleMove(AIplaceboard)[AIspot] //With the index of the best score get the position on the board using the remaining moves array
    }
      //console.log("Moving at "+Choice)

      return Place("O",Choice,AIplaceboard) // Placing
}





//
function CheckWin(TestBoard){ //Get the winner of a given board

  let Whowon = "T" //default to tie

  for (let i = 0;i<9;i++){
    if (TestBoard[i] == " "){ //if there are empty tiles it cannot be tied
      Whowon = "F"
    }
  }

  for (let i = 0; i<3 ; i++){

    if (TestBoard[2+i*3] != " " && TestBoard[i*3] == TestBoard[2+i*3] && TestBoard[1+i*3] == TestBoard[2+i*3] ){ 
      Whowon = TestBoard[i*3] //horizontal check, every iteration increases index by 3, checking the row below
    }

    else if (TestBoard[6+i] != " " && TestBoard[i] == TestBoard[3+i] && TestBoard[i] == TestBoard[6+i] ) {
      Whowon = TestBoard[6+i] //vertical check, every iteration increases index by 1, checking the column to the right
    }

    else if ( i < 2 && TestBoard[8-i*2] != " " && TestBoard[i*2] == TestBoard[8-i*2] && TestBoard[4] == TestBoard[8-i*2] ) {
      Whowon = TestBoard[8-i*2] // diagonal check, only for the first 2 iterations, second iteration checks opposite corners
    }
  }

  //console.log("Whowon: "+Whowon+". "+TestBoard)
  return Whowon //Return winner
}


function Restart(){

    Board = [" "," "," "," "," "," "," "," "," "] //Reset Board to empty
    UpdateBoard() //Update Board
}



function toggleclass(Class){ //Toggles a class on the body element, effecting all other elements

      document.getElementById("body").classList.toggle(Class)
}


function Minimax(CopyBoard,depth){ // AI minimax algorithm

    depth++ //Increase the depth of the algorithm, influences score to prioritise fast wins and slow losses

    let AIBoard = CopyBoard.slice(0) //Get a copy of the Board
    if (CheckWin(AIBoard)  != "F") { //If the board has finished
        //Possoutcomes[CheckWin(AIBoard)] += 1 // Tally winner to number of possible outcomes
        return [BoardScore(AIBoard,depth),0] //Return the score of the board, second item in returned array is used for the index of the move
    }

    let ScoreArray = [] //Score that holds points for each move
    let moves = PossibleMove(AIBoard) //Get Possible moves for AI

    for (let move_n = 0; move_n < moves.length; move_n++) { //For each possible move

        let possible_board = AIBoard.slice(); //Get copy of board
        let nextp = NextPiece(possible_board) //Get Next Piece of the board
        possible_board = Place(nextp,moves[move_n],possible_board)//Get a temporary copy of a possible Piece placement     
        ScoreArray.push(Minimax(possible_board.slice(),depth)[0]) //Get the score of this possible placement, recursing the algorithm
    }

    if (NextPiece(AIBoard) == "O") { //If the move is AI

        let MaxScore = Index("Max", ScoreArray) //Find the best score

        return [ScoreArray[MaxScore],MaxScore] //Return the highest possible score the AI can make and its index

    } else { //If it is the player's turn

        let MinScore = Index("Min", ScoreArray)// Assume they make the best possible move, worst for AI
        return [ScoreArray[MinScore],MinScore] //Return the player's best move
    }
}

function storescore() {
    localStorage.X = TimesWon[0] //Store score value
    localStorage.O = TimesWon[1] //^
}


function UpdateBoard(){ //Main loop, waits for input

    let positions = document.getElementsByClassName("position") // Get tile HTML Elements

    let next = NextPiece(Board) // Get the next piece to be played

    let Winner = CheckWin(Board) //Get the winner on the board

    let Opponent = AIswitch.classList.contains("on") // True if switch is on ai

    if (Opponent == true && next == "O" && Winner == "F") { // If switch is on, ai move is next and game hasn't ended

      Board = AImove(Board) // AI Moves

      next = NextPiece(Board) // Recheck for the next to be placed

      Winner = CheckWin(Board) // Check if the AI won

    }



    if (Winner != "F") {

      if (Winner =="X"){ TimesWon[0] += 1 } // Add point to the winner
      if (Winner =="O"){ TimesWon[1] += 1 } // ^
      storescore() // Stores scores



      document.getElementById("score").innerHTML = `${TimesWon[0]} - ${TimesWon[1]}` // Update the Score element
    }


    for (let p=0; p<9 ; p++){ //for each tile, update visuals and onclick effects



      if (Board[p] != " "){ //If tile not empty
        if (positions[p].className == "position"){ 
         positions[p].className += (" " + Board[p]) // if square has piece add class to display   
        }
      }
      else{
       positions[p].className = "position" // if no piece don't display one
      }
      

      positions[p].setAttribute("onclick","") // don't allow placing piece on already placed piece

      if (Board[p] == " " && Winner == "F"){ //Empty tile when game has not finished
        positions[p].setAttribute("onclick",`Board = Place('${next}',${p},Board);UpdateBoard()`) // set every empty tile onclick to place piece
      }


      if (Winner !="F"){ //If game has ended (when there is a winner or tie)
        if ( Winner == "T" || CheckWin(Board.with(p," ")) == CheckWin(Board)){ //All pieces lose on a tie, on a win highlight all pieces that contributed to the win.
          positions[p].className += " lost" // Losing pieces get the lost class
        }

        else{
          positions[p].className += " won" // Winning pieces get the won class
        }

        positions[p].setAttribute("onclick","Restart()") // When game finished clicking on a tile will restart
      }

    }

  }


let Board = [" "," "," "," "," "," "," "," "," "] //3*3 tile grid
let TimesWon = [0,0] //X and O scores respectively
let positions //Global variable for the HTML tiles
//let Possoutcomes = {"X":0,"O":0,"T":0} //Tally for number of possible outcomes

window.onload = function(){//When the HTML loads

    positions = document.getElementsByClassName("position") //Get refrences to tiles

    AIswitch = document.getElementById('aiswitch') //Get reference to the choice of AI

    if (localStorage.length != 0){
      TimesWon = [parseInt(localStorage.X),parseInt(localStorage.O)] //Get score from storage
      document.getElementById("score").innerHTML = `${TimesWon[0]} - ${TimesWon[1]}` // Update Score display
    }
    UpdateBoard() //Initialisation of the Board

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleclass("night") //Automatic Dark Mode
    }


}



