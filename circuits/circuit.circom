pragma circom 2.0.0;

include "./functions/getDirectionForMove.circom";
include "./functions/getTileCodeFromCoords.circom";
include "./functions/isTileOpenForSide.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template Game(N) {
  signal input moves[N][2];
  var OUT_OF_RANGE = 100;

  // result
  // out[0] is moves ok
  // out[1] is reached end
  signal output out[2];

  var tileCode;
  var direction;
  var tileOpen;
  var currentX;
  var currentY;
  var nextX;
  var nextY;
  var movesOk = 1;
  var lastMove[2];
  signal xAtEnd;
  signal yAtEnd;
  signal cX;
  signal cY;
  signal reachedEnd;
  lastMove[0] = OUT_OF_RANGE;
  lastMove[1] = OUT_OF_RANGE;

  // Make sure the initial position is [0,0];
  var startX =  moves[0][0];
  var startY =  moves[0][1];
  movesOk *= startX == 0 ? 1 : 0;
  movesOk *= startY == 0 ? 1 : 0;

  // @dev: signals usually preferred but this is just array lookup so should be fine
  for (var m = 0; m < N-1; m++) {
    currentX = moves[m][0];
    currentY = moves[m][1];
    nextX = moves[m+1][0];
    nextY = moves[m+1][1];

    // Get current tile type
    tileCode = getTileCodeFromCoords(currentX, currentY);
    if (nextX == OUT_OF_RANGE && nextY == OUT_OF_RANGE && currentX != OUT_OF_RANGE && currentY != OUT_OF_RANGE) {
      lastMove[0] = currentX;
      lastMove[1] = currentY;
    }

    if (nextX != OUT_OF_RANGE && nextY != OUT_OF_RANGE) {
      // Check if exiting the tile in that direction is ok
      direction = getDirectionForMove(currentX, currentY, nextX, nextY);
      tileOpen = isTileOpenForSide(tileCode, direction); // I.e. if success is zero, movesOk becomes zero
      movesOk *= tileOpen;
    }
  }

  component xEq = IsEqual();
  xEq.in[0] <-- lastMove[0];
  xEq.in[1] <-- 5;
  xAtEnd <-- xEq.out;

  component yEq = IsEqual();
  yEq.in[0] <-- lastMove[1];
  yEq.in[1] <-- 5;
  yAtEnd <-- yEq.out;

  reachedEnd <-- xAtEnd * yAtEnd;

  out[0] <-- movesOk;
  out[1] <-- reachedEnd;
}

component main = Game(200);
