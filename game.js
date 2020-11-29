let canvas = document.getElementById("canvas");
canvas.width = 550;
canvas.height = 550;
let c = canvas.getContext("2d");

let mode = "menu";
let turn = "player";

let player = "white";
let ai = "black";
//_____________________________________________________________
let images = {};
let imageElements = document.getElementsByClassName("image");
const htmlFileName = "chess.html";

for (let i = 0; i < imageElements.length; i++) {
  images[
    JSON.stringify(imageElements[i].src).substring(
      JSON.stringify(location.href).length - htmlFileName.length + 6,
      JSON.stringify(imageElements[i].src).length - 5
    )
  ] = imageElements[i];
}
console.log(images);

function drawBackground() {
  c.drawImage(images["background"], 0, 0, canvas.width, canvas.height);
}

//================================================================
let board = [
  [
    "blackRook1",
    "blackKnight1",
    "blackBishop1",
    "blackQueen1",
    "blackKing1",
    "blackBishop2",
    "blackKnight2",
    "blackRook2",
  ],
  [
    "blackPawn1",
    "blackPawn2",
    "blackPawn3",
    "blackPawn4",
    "blackPawn5",
    "blackPawn6",
    "blackPawn7",
    "blackPawn8",
  ],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [
    "whitePawn1",
    "whitePawn2",
    "whitePawn3",
    "whitePawn4",
    "whitePawn5",
    "whitePawn6",
    "whitePawn7",
    "whitePawn8",
  ],
  [
    "whiteRook1",
    "whiteKnight1",
    "whiteBishop1",
    "whiteQueen1",
    "whiteKing1",
    "whiteBishop2",
    "whiteKnight2",
    "whiteRook2",
  ],
];

function drawBoardPieces() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] != 0) {
        c.drawImage(
          images[board[i][j].substring(0, board[i][j].length - 1)],
          calculateCoordinateRC(j, i)[0],
          calculateCoordinateRC(j, i)[1],
          canvas.width / 8,
          canvas.height / 8
        );
      }
    }
  }
}
function moveGamePiece(
  iniRow,
  iniColumn,
  endRow,
  endColumn,
  testBoard,
  checkIfRoque = true
) {
  let boardte = JSON.parse(JSON.stringify(testBoard));

  boardte[endColumn][endRow] = boardte[iniColumn][iniRow];
  boardte[iniColumn][iniRow] = 0;

  //Roque
  if (
    boardte[endColumn][endRow].substring(5) == "King1" &&
    iniRow == 4 &&
    Math.abs(iniRow - endRow) == 2 &&
    checkIfRoque
  ) {
    if (iniRow > endRow) {
      boardte[endColumn][3] = boardte[endColumn][0];
      boardte[endColumn][0] = 0;
    } else {
      boardte[endColumn][5] = boardte[endColumn][7];
      boardte[endColumn][7] = 0;
    }
  }

  //Transform end Pawns
  if (
    boardte[endColumn][endRow].substring(
      5,
      boardte[endColumn][endRow].length - 1
    ) == "Pawn" &&
    endColumn == 0 &&
    boardte[endColumn][endRow].substring(0, 5) == player
  ) {
    boardte[endColumn][endRow] = player + "Queen2";
  } else if (
    boardte[endColumn][endRow].substring(
      5,
      boardte[endColumn][endRow].length - 1
    ) == "Pawn" &&
    endColumn == 7 &&
    boardte[endColumn][endRow].substring(0, 5) == ai
  ) {
    boardte[endColumn][endRow] = ai + "Queen2";
  }

  return boardte;
}

function updateMovementGamePiece(iniRow, iniColumn, endRow, endColumn) {
  updateRoqueCheck(iniRow, iniColumn);
  board = moveGamePiece(iniRow, iniColumn, endRow, endColumn, board);
}
function simulateRoqueStatChange(gamePiece, roqueStats) {
  let rStats = JSON.parse(JSON.stringify(roqueStats));
  for (property in rStats) {
    if (gamePiece == property) {
      rStats[property] = true;
    }
  }
  return rStats;
}

function updateRoqueCheck(rowOfmovingPiece, columnOfMovingPiece) {
  for (property in oriRoqueCheck) {
    if (board[columnOfMovingPiece][rowOfmovingPiece] == property) {
      oriRoqueCheck[property] = true;
    }
  }
}

//====================================================================
function calculateCoordinateRC(row, column) {
  let x = (row * canvas.width) / 8;
  let y = (column * canvas.height) / 8;
  return [x, y];
}
//==============================================check
function checkIfKingNotEndangered(boardt, roqueStats, playersColor) {
  let notEndengered = true;
  let kingsPos = [];
  let possibleMoves = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //If not empty
      if (boardt[i][j] != 0) {
        //save every move from opposition
        if (boardt[i][j].substring(0, 5) != playersColor) {
          let moves = availableMoves(j, i, boardt, roqueStats);

          for (let k = 0; k < moves.length; k++) {
            possibleMoves.push(moves[k]);
          }
        } else if (boardt[i][j] == playersColor + "King1") {
          kingsPos = [j, i];
        }
      }
    }
  }

  for (let i = 0; i < possibleMoves.length; i++) {
    if (
      possibleMoves[i][0] == kingsPos[0] &&
      possibleMoves[i][1] == kingsPos[1]
    ) {
      notEndengered = false;
      break;
    }
  }

  return notEndengered;
}
function checkIfKingMovWontCheck(
  iniRow,
  iniColumn,
  endRow,
  endColumn,
  boardt,
  roqueStats,
  playersColor
) {
  let theBoard = moveGamePiece(iniRow, iniColumn, endRow, endColumn, boardt);
  return checkIfKingNotEndangered(theBoard, roqueStats, playersColor);
}
function locateKing(playersColor, tBoard) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //If not empty
      if (tBoard[i][j] != 0) {
        //if King from player
        if (tBoard[i][j] == playersColor + "King1") {
          return [j, i];
        }
      }
    }
  }
  return 0;
}
function checkmatePlayer(boardt, roqueStats) {
  let inCheck = true;
  if (checkIfKingNotEndangered(boardt, roqueStats, player)) {
    inCheck = false;
  }
  //if not checkmate for player
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardt[i][j] != 0 && boardt[i][j].substring(0, 5) == player) {
        let moves = availableMoves(j, i, boardt, roqueStats);

        for (let k = 0; k < moves.length; k++) {
          if (
            checkIfKingMovWontCheck(
              j,
              i,
              moves[k][0],
              moves[k][1],
              boardt,
              roqueStats,
              player
            )
          ) {
            return "";
          }
        }
      }
    }
  }
  if (inCheck) {
    return "checkmate";
  } else {
    return "tie";
  }
}
function checkmateAI(boardt, roqueStats) {
  let inCheck = true;
  if (checkIfKingNotEndangered(boardt, roqueStats, ai)) {
    inCheck = false;
  }
  //if not checkmate for ai
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardt[i][j] != 0 && boardt[i][j].substring(0, 5) == ai) {
        let moves = availableMoves(j, i, boardt, roqueStats);

        for (let k = 0; k < moves.length; k++) {
          if (
            checkIfKingMovWontCheck(
              j,
              i,
              moves[k][0],
              moves[k][1],
              boardt,
              roqueStats,
              ai
            )
          ) {
            return "";
          }
        }
      }
    }
  }
  if (inCheck) {
    return "checkmate";
  } else {
    return "tie";
  }
}
//====================available moves===================
function availableMoves(row, column, selecBoard, roqueStats) {
  switch (
    selecBoard[column][row].substring(5, selecBoard[column][row].length - 1)
  ) {
    case "Pawn":
      return availableMovesPawn(
        row,
        column,
        selecBoard[column][row].substring(0, 5),
        selecBoard
      );
    case "Rook":
      return availableMovesRook(
        row,
        column,
        selecBoard[column][row].substring(0, 5),
        selecBoard
      );
    case "Knight":
      return availableMovesKnight(
        row,
        column,
        selecBoard[column][row].substring(0, 5),
        selecBoard
      );
    case "Bishop":
      return availableMovesBishop(
        row,
        column,
        selecBoard[column][row].substring(0, 5),
        selecBoard
      );
    case "Queen":
      return availableMovesQueen(
        row,
        column,
        selecBoard[column][row].substring(0, 5),
        selecBoard
      );
    case "King":
      return availableMovesKing(
        row,
        column,
        selecBoard[column][row].substring(0, 5),
        selecBoard,
        roqueStats
      );
    default:
      return [];
  }
}
//
function availableMovesPawn(row, column, color, boardt) {
  let results = [];
  let dir;

  if (ai == color) dir = 1;
  else if (player == color) dir = -1;
  else console.warn("Error gamePiece identity not clarified");

  //Simple move
  if (boardt[column + dir][row] == 0) {
    results.push([row, column + dir]);

    //Double move at start
    if (column == 6 && boardt[column - 2][row] == 0 && dir == -1) {
      results.push([row, column + dir * 2]);
    } else if (column == 1 && boardt[column + 2][row] == 0 && dir == 1) {
      results.push([row, column + dir * 2]);
    }
  }
  //Eat enemy diagonal
  if (
    row + 1 <= 7 &&
    boardt[column + dir][row + 1] != 0 &&
    boardt[column + dir][row + 1].substring(0, 5) != color
  ) {
    results.push([row + 1, column + dir]);
  }
  if (
    row - 1 >= 0 &&
    boardt[column + dir][row - 1] != 0 &&
    boardt[column + dir][row - 1].substring(0, 5) != color
  ) {
    results.push([row - 1, column + dir]);
  }

  return results;
}
function availableMovesRook(row, column, color, boardt) {
  let results = [];

  //Vertical down
  for (let i = 1; i < 8; i++) {
    if (column + i > 7) {
      break;
    } else if (boardt[column + i][row] != 0) {
      if (boardt[column + i][row].substring(0, 5) == color) {
        break;
      } else {
        results.push([row, column + i]);
        break;
      }
    } else {
      results.push([row, column + i]);
    }
  }
  //Horizontal right
  for (let i = 1; i < 8; i++) {
    if (row + i > 7) {
      break;
    } else if (boardt[column][row + i] != 0) {
      if (boardt[column][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column]);
        break;
      }
    } else {
      results.push([row + i, column]);
    }
  }
  //Horizontal left
  for (let i = -1; i > -8; i--) {
    if (row + i < 0) {
      break;
    } else if (boardt[column][row + i] != 0) {
      if (boardt[column][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column]);
        break;
      }
    } else {
      results.push([row + i, column]);
    }
  }
  //Vertical up
  for (let i = -1; i > -8; i--) {
    if (column + i < 0) {
      break;
    } else if (boardt[column + i][row] != 0) {
      if (boardt[column + i][row].substring(0, 5) == color) {
        break;
      } else {
        results.push([row, column + i]);
        break;
      }
    } else {
      results.push([row, column + i]);
    }
  }

  return results;
}
function availableMovesKnight(row, column, color, boardt) {
  let results = [];

  //Up and down movement
  for (let i = -2; i <= 2; i += 4) {
    for (let j = -1; j <= 1; j += 2) {
      //outta boundaries
      if (column + i >= 0 && column + i <= 7 && row + j >= 0 && row + j <= 7) {
        //if not on ally
        if (
          boardt[column + i][row + j] == 0 ||
          boardt[column + i][row + j].substring(0, 5) != color
        ) {
          results.push([row + j, column + i]);
        }
      }
    }
  }
  //Right and left movemnt
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -2; j <= 2; j += 4) {
      //outta boundaries
      if (column + i >= 0 && column + i <= 7 && row + j >= 0 && row + j <= 7) {
        //if not on ally
        if (
          boardt[column + i][row + j] == 0 ||
          boardt[column + i][row + j].substring(0, 5) != color
        ) {
          results.push([row + j, column + i]);
        }
      }
    }
  }

  return results;
}
function availableMovesBishop(row, column, color, boardt) {
  let results = [];

  //DOWN_RIGHT
  for (let i = 1; i < 8; i++) {
    if (column + i > 7 || row + i > 7) {
      break;
    } else if (boardt[column + i][row + i] != 0) {
      if (boardt[column + i][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column + i]);
        break;
      }
    } else {
      results.push([row + i, column + i]);
    }
  }
  //DOWN_LEFT
  for (let i = 1; i < 8; i++) {
    if (column + i > 7 || row - i < 0) {
      break;
    } else if (boardt[column + i][row - i] != 0) {
      if (boardt[column + i][row - i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row - i, column + i]);
        break;
      }
    } else {
      results.push([row - i, column + i]);
    }
  }
  //UP_LEFT
  for (let i = -1; i > -8; i--) {
    if (column + i < 0 || row + i < 0) {
      break;
    } else if (boardt[column + i][row + i] != 0) {
      if (boardt[column + i][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column + i]);
        break;
      }
    } else {
      results.push([row + i, column + i]);
    }
  }
  //UP_RIGHT
  for (let i = 1; i < 8; i++) {
    if (column - i < 0 || row + i > 7) {
      break;
    } else if (boardt[column - i][row + i] != 0) {
      if (boardt[column - i][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column - i]);
        break;
      }
    } else {
      results.push([row + i, column - i]);
    }
  }

  return results;
}
function availableMovesQueen(row, column, color, boardt) {
  let results = [];

  //LEFT RIGHT UP DOWN
  //Vertical down
  for (let i = 1; i < 8; i++) {
    if (column + i > 7) {
      break;
    } else if (boardt[column + i][row] != 0) {
      if (boardt[column + i][row].substring(0, 5) == color) {
        break;
      } else {
        results.push([row, column + i]);
        break;
      }
    } else {
      results.push([row, column + i]);
    }
  }
  //Horizontal right
  for (let i = 1; i < 8; i++) {
    if (row + i > 7) {
      break;
    } else if (boardt[column][row + i] != 0) {
      if (boardt[column][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column]);
        break;
      }
    } else {
      results.push([row + i, column]);
    }
  }
  //Horizontal left
  for (let i = -1; i > -8; i--) {
    if (row + i < 0) {
      break;
    } else if (boardt[column][row + i] != 0) {
      if (boardt[column][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column]);
        break;
      }
    } else {
      results.push([row + i, column]);
    }
  }
  //Vertical up
  for (let i = -1; i > -8; i--) {
    if (column + i < 0) {
      break;
    } else if (boardt[column + i][row] != 0) {
      if (boardt[column + i][row].substring(0, 5) == color) {
        break;
      } else {
        results.push([row, column + i]);
        break;
      }
    } else {
      results.push([row, column + i]);
    }
  }
  //DIAGONAL==
  //DOWN_RIGHT
  for (let i = 1; i < 8; i++) {
    if (column + i > 7 || row + i > 7) {
      break;
    } else if (boardt[column + i][row + i] != 0) {
      if (boardt[column + i][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column + i]);
        break;
      }
    } else {
      results.push([row + i, column + i]);
    }
  }
  //DOWN_LEFT
  for (let i = 1; i < 8; i++) {
    if (column + i > 7 || row - i < 0) {
      break;
    } else if (boardt[column + i][row - i] != 0) {
      if (boardt[column + i][row - i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row - i, column + i]);
        break;
      }
    } else {
      results.push([row - i, column + i]);
    }
  }
  //UP_LEFT
  for (let i = -1; i > -8; i--) {
    if (column + i < 0 || row + i < 0) {
      break;
    } else if (boardt[column + i][row + i] != 0) {
      if (boardt[column + i][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column + i]);
        break;
      }
    } else {
      results.push([row + i, column + i]);
    }
  }
  //UP_RIGHT
  for (let i = 1; i < 8; i++) {
    if (column - i < 0 || row + i > 7) {
      break;
    } else if (boardt[column - i][row + i] != 0) {
      if (boardt[column - i][row + i].substring(0, 5) == color) {
        break;
      } else {
        results.push([row + i, column - i]);
        break;
      }
    } else {
      results.push([row + i, column - i]);
    }
  }

  return results;
}
let oriRoqueCheck = {
  blackRook1: false,
  blackRook2: false,
  blackKing1: false,

  whiteRook1: false,
  whiteRook2: false,
  whiteKing1: false,
};
let testRoqueCheck = {
  blackRook1: false,
  blackRook2: false,
  blackKing1: false,

  whiteRook1: false,
  whiteRook2: false,
  whiteKing1: false,
};
function availableMovesKing(row, column, color, boardt, roqueStats) {
  let results = [];

  //Down et up movements (including the diagonals)
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j++) {
      if (row + j >= 0 && row + j <= 7 && column + i >= 0 && column + i <= 7) {
        if (
          boardt[column + i][row + j] == 0 ||
          boardt[column + i][row + j].substring(0, 5) != color
        ) {
          results.push([row + j, column + i]);
        }
      }
    }
  }
  //Left and right movemnt
  for (let i = -1; i <= 1; i++) {
    if (row + i >= 0 && row + i <= 7) {
      if (
        boardt[column][row + i] == 0 ||
        boardt[column][row + i].substring(0, 5) != color
      ) {
        results.push([row + i, column]);
      }
    }
  }

  //LE coup du roque AAAAAAHHH

  //player basic requirements
  if (
    column == 7 &&
    row == 4 &&
    color == player &&
    !roqueStats[color + "King1"]
  ) {
    //little roque player
    if (
      boardt[7][5] == 0 &&
      boardt[7][6] == 0 &&
      boardt[7][7] == color + "Rook2" &&
      !roqueStats[color + "Rook2"]
    ) {
      results.push([6, 7]);
    }
    //Grand roque player
    if (
      boardt[7][3] == 0 &&
      boardt[7][2] == 0 &&
      boardt[7][1] == 0 &&
      boardt[7][0] == color + "Rook1" &&
      !roqueStats[color + "Rook1"]
    ) {
      results.push([2, 7]);
    }
  } else if (
    column == 0 &&
    row == 4 &&
    color == ai &&
    !roqueStats[color + "King1"]
  ) {
    //little roque ai
    if (
      boardt[0][5] == 0 &&
      boardt[0][6] == 0 &&
      boardt[0][7] == color + "Rook2" &&
      !roqueStats[color + "Rook2"]
    ) {
      results.push([6, 0]);
    }
    //Grand Roque ai
    if (
      boardt[0][3] == 0 &&
      boardt[0][2] == 0 &&
      boardt[0][1] == 0 &&
      boardt[0][0] == color + "Rook1" &&
      !roqueStats[color + "Rook1"]
    ) {
      results.push([2, 0]);
    }
  }

  return results;
}
//====================Event
canvas.addEventListener("mouseup", clicked);
let selectedCell = [];
let selecCellAvSpots = [];

function clicked(e) {
  if (mode == "game" && turn == "player") {
    //Check Mouse cell
    let chosenRow = Math.floor(e.offsetX / (canvas.width / 8));
    let chosenColumn = Math.floor(e.offsetY / (canvas.height / 8));

    if (selectedCell.length != 2) {
      selectedCell = [chosenRow, chosenColumn];
      if (
        board[chosenColumn][chosenRow] != 0 &&
        board[chosenColumn][chosenRow].substring(0, 5) == player
      ) {
        selecCellAvSpots = availableMoves(
          selectedCell[0],
          selectedCell[1],
          board,
          oriRoqueCheck
        );

        for (let i = 0; i < selecCellAvSpots.length; i++) {
          if (
            !checkIfKingMovWontCheck(
              chosenRow,
              chosenColumn,
              selecCellAvSpots[i][0],
              selecCellAvSpots[i][1],
              board,
              oriRoqueCheck,
              player
            )
          ) {
            selecCellAvSpots.splice(i, 1);
            i--;
          }
        }
      }
    } else {
      //move
      let clickedOnAvSpot = [];
      for (let i = 0; i < selecCellAvSpots.length; i++) {
        if (
          chosenRow == selecCellAvSpots[i][0] &&
          chosenColumn == selecCellAvSpots[i][1]
        ) {
          clickedOnAvSpot = selecCellAvSpots[i];
          break;
        }
      }
      if (clickedOnAvSpot.length == 2) {
        console.log("ey");
        updateMovementGamePiece(
          selectedCell[0],
          selectedCell[1],
          chosenRow,
          chosenColumn
        );

        let gameState2 = checkmatePlayer(board, oriRoqueCheck);
        if (gameState2 == "checkmate" || gameState2 == "tie") {
          alert(gameState2);
          mode = "gameOver";
        }
        showTurns.innerHTML = "ENEMY's TURN";
        tic.play();
        turn = "ai";
      }
      selectedCell = [];
      selecCellAvSpots = [];
    }
  }

  //OOWPDOWDPWODWPODWPODWPDOWPDOWPDO
  let gameState = checkmatePlayer(board, oriRoqueCheck);
  if (gameState == "checkmate" || gameState == "tie") {
    alert(gameState);
    mode = "gameOver";
  }
}

function drawSelectedCell() {
  if (selectedCell.length == 2) {
    c.globalAlpha = 0.4;
    c.fillStyle = "cyan";
    c.fillRect(
      (selectedCell[0] * canvas.width) / 8,
      (selectedCell[1] * canvas.height) / 8,
      canvas.width / 8,
      canvas.height / 8
    );

    if (board[selectedCell[1]][selectedCell[0]] != 0) {
      for (let i = 0; i < selecCellAvSpots.length; i++) {
        c.fillStyle = "lime";
        c.fillRect(
          (selecCellAvSpots[i][0] * canvas.width) / 8,
          (selecCellAvSpots[i][1] * canvas.height) / 8,
          canvas.width / 8,
          canvas.height / 8
        );
      }
    }
  }
  c.globalAlpha = 1;
}
