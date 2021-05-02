let movesSeenAhead = 3;
let showTurns = document.getElementById("turns");

function changeColor() {
  if (player == "white") {
    player = "black";
    ai = "white";
  }

  let newBoard = [];

  for (let i = 0; i < 8; i++) {
    newBoard.push(board[7 - i]);
  }
  board = newBoard;
}

function start() {
  mode = "game";

  document.getElementById("start").style.display = "none";
  document.getElementById("color").style.display = "none";
  document.getElementById("plus").style.display = "none";
  document.getElementById("minus").style.display = "none";
  document.getElementById("moves").style.display = "none";

  showTurns.style.display = "block";

  if (ai == "white") {
    turn = "ai";
    showTurns.innerHTML = "ENEMY's TURN";
  }
}

function changeMoves(num) {
  if ((num < 0 && movesSeenAhead == 1)||(num>0&&movesSeenAhead == 3)) {
  } else {
    movesSeenAhead += num;
  }

  document.getElementById("moves").innerHTML =
    "MOVES SEEN AHEAD " + movesSeenAhead;
}

function modifyAiTurn() {
  if (showTurns.innerHTML.length < 16) {
    showTurns.innerHTML += ".";
  } else {
    showTurns.innerHTML = "ENEMY's TURN";
  }
}

let tic = new Audio();
tic.src = "toc.mp3";
