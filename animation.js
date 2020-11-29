let count = 0;
function draw() {
  requestAnimationFrame(draw);
  c.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawBoardPieces();
  if (mode == "game") {
    if (turn == "player") {
      drawBoardPieces();
      drawSelectedCell();
      count = 0;
      if (!checkIfKingNotEndangered(board, oriRoqueCheck, player)) {
        c.globalAlpha = 0.25;
        c.fillStyle = "red";
        c.fillRect(
          (locateKing(player, board)[0] * canvas.width) / 8,
          (locateKing(player, board)[1] * canvas.width) / 8,
          canvas.width / 8,
          canvas.height / 8
        );
        c.globalAlpha = 1;
      }
    } else if (turn == "ai") {
      if (count > 2) {
        aiTurn();
      } else {
        count++;
      }
    } else if (turn == "player1") {
      tic.play();
      turn = "player";
    }
  }
}
draw();
