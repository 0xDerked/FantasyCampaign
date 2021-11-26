pragma circom 2.0.0;

include "./functions/getDirectionForMove.circom";
include "./functions/getTileCodeFromCoords.circom";
include "./functions/isTileOpenForSide.circom";

template Game(N) {
  signal input moves[N][2];

  // result
  signal output out;

  var tileCode;
  var direction;
  var tileOpen;
  var currentX;
  var currentY;
  var nextX;
  var nextY;
  var movesOk = 1;

  var OUT_OF_RANGE = 100;

  // Make sure the initial position is [0,0];
  var startX =  moves[0][0];
  var startY =  moves[0][1];
  movesOk *= startX == 0 ? 1 : 0;
  movesOk *= startY == 0 ? 1 : 0;

  for (var m = 0; m < 3; m++) {
    currentX = moves[m][0];
    currentY = moves[m][1];
    nextX = moves[m+1][0];
    nextY = moves[m+1][1];

    // Get current tile type
    tileCode = getTileCodeFromCoords(currentX, currentY);

    // Check if exiting the tile in that direction is ok
    direction = getDirectionForMove(currentX, currentY, nextX, nextY);
    tileOpen = isTileOpenForSide(tileCode, direction); // I.e. if success is zero, movesOk becomes zero

    movesOk *= tileOpen;
  }

  out <-- movesOk;
}

component main = Game(10);
