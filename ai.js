let piecePoints = {
  whitePawn: -100,
  whiteRook: -500,
  whiteKnight: -300,
  whiteBishop: -300,
  whiteQueen: -900,
  whiteKing: -9000,

  blackPawn: 100,
  blackRook: 500,
  blackKnight: 300,
  blackBishop: 300,
  blackQueen: 900,
  blackKing: 9000,
};

pawnTable = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

knightTable = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

bishopTable = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

rookTable = [
  [0, 0, 0, 5, 5, 0, 0, 0],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

queenTable = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

kingTable = [
  [20, 30, 10, 0, 0, 10, 30, 20],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
];

function evaluateScoreTable(pieceName, row, column) {
  if (pieceName.substring(0, 5) == ai) {
    switch (pieceName.substring(5, pieceName.length - 1)) {
      case "Pawn":
        return pawnTable[column][row];
      case "Rook":
        return rookTable[column][row];
      case "Knight":
        return knightTable[column][row];
      case "Bishop":
        return bishopTable[column][row];
      case "Queen":
        return queenTable[column][row];
      case "King":
        return kingTable[column][row];
      default:
        return 0;
    }
  } else {
    switch (pieceName.substring(5, pieceName.length - 1)) {
      case "Pawn":
        return -pawnTable[7 - column][row];
      case "Rook":
        return -rookTable[7 - column][row];
      case "Knight":
        return -knightTable[7 - column][row];
      case "Bishop":
        return -bishopTable[7 - column][row];
      case "Queen":
        return -queenTable[7 - column][row];
      case "King":
        return -kingTable[7 - column][row];
      default:
        return 0;
    }
  }
}

function calculateScore(boardt) {
  let score = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardt[i][j] != 0) {
        score +=
          piecePoints[boardt[i][j].substring(0, boardt[i][j].length - 1)];
        score += evaluateScoreTable(boardt[i][j], j, i);
      }
    }
  }
  if (ai == "white") {
    score *= -1;
  }
  return score;
}

function aiTurn() {
  let bestMove = {};
  let bestScore = -Infinity;

  //Check every piece
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] != 0 && board[i][j].substring(0, 5) == ai) {
        //Every moves for one piece
        let evMoves = availableMoves(j, i, board, oriRoqueCheck);

        for (let k = 0; k < evMoves.length; k++) {
          let newTestBoard = moveGamePiece(
            j,
            i,
            evMoves[k][0],
            evMoves[k][1],
            board
          );
          let newRoqueStats = simulateRoqueStatChange(
            board[i][j],
            oriRoqueCheck
          );
          if (!checkIfKingNotEndangered(newTestBoard, newRoqueStats, ai)) {
            
            continue; //
            console.log(1);
          }
          let score = minimax(
            newTestBoard,
            newRoqueStats,
            movesSeenAhead,
            bestScore,
            Infinity,
            false
          );

          //Note: Is alpha: best score?
          if (bestScore < score) {
            bestScore = score;
            bestMove.iniRow = j;
            bestMove.iniColumn = i;
            bestMove.endRow = evMoves[k][0];
            bestMove.endColumn = evMoves[k][1];
          }
        }
      }
    }
  }

  //move the piece
  updateMovementGamePiece(
    bestMove.iniRow,
    bestMove.iniColumn,
    bestMove.endRow,
    bestMove.endColumn
  );

  showTurns.innerHTML = "YOUR TURN";

  turn = "player1";
}
function minimax(tBoard, roqueStats, depth, alpha, beta, isMaximizing) {
  let alp = alpha;
  let bet = beta;
  let gameState = checkmatePlayer(tBoard, roqueStats);

  if (locateKing(player, tBoard) == 0 || gameState == "checkmate") {
    return Number.MAX_VALUE;
  } else if (locateKing(ai, tBoard) == 0) {
    return -Number.MAX_VALUE;
  } else if (gameState == "tie") {
    return 0;
  } else if (depth == 0) {
    return calculateScore(tBoard);
  }

  if (isMaximizing) {
    let bestValue = -Infinity;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (tBoard[i][j] != 0 && tBoard[i][j].substring(0, 5) == ai) {
          //Every moves for one piece
          let evMoves = availableMoves(j, i, tBoard, roqueStats);

          for (let k = 0; k < evMoves.length; k++) {
            let newTestBoard = moveGamePiece(
              j,
              i,
              evMoves[k][0],
              evMoves[k][1],
              tBoard
            );
            let newRoqueStats = simulateRoqueStatChange(
              tBoard[i][j],
              roqueStats
            );
            if (!checkIfKingNotEndangered(newTestBoard, newRoqueStats, ai))
              continue; //
            let newValue = minimax(
              newTestBoard,
              newRoqueStats,
              depth - 1,
              alp,
              bet,
              false
            );
            bestValue = Math.max(bestValue, newValue);
            alp = Math.max(bestValue, alp);
            //Branch cut
            if (alp >= bet) {
              break;
            }
          }
        }
      }
    }
    return bestValue;
  } else {
    let bestValue = Infinity;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (tBoard[i][j] != 0 && tBoard[i][j].substring(0, 5) == player) {
          //Every moves for one piece
          let evMoves = availableMoves(j, i, tBoard, roqueStats);
          for (let k = 0; k < evMoves.length; k++) {
            let newTestBoard = moveGamePiece(
              j,
              i,
              evMoves[k][0],
              evMoves[k][1],
              tBoard
            );
            let newRoqueStats = simulateRoqueStatChange(
              tBoard[i][j],
              roqueStats
            );
            if (!checkIfKingNotEndangered(newTestBoard, newRoqueStats, player))
              continue;
            let newValue = minimax(
              newTestBoard,
              newRoqueStats,
              depth - 1,
              alp,
              bet,
              true
            );
            bestValue = Math.min(bestValue, newValue);
            bet = Math.min(bestValue, bet);
            //Branch cut
            if (alp >= bet) {
              break;
            }
          }
        }
      }
    }
    return bestValue;
  }
}

console.log("update 1")
