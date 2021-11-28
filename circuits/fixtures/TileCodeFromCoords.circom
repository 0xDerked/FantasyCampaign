pragma circom 2.0.0;

include "../functions/getTileCodeFromCoords.circom";

// FOR TESTING THE FUNCTION
template TileCodeFromCoords() {
  signal input x;
  signal input y;
  signal output tileCode;
  var code = getTileCodeFromCoords(x, y);
  tileCode <-- code;
}


component main {public [x,y]} = TileCodeFromCoords();
