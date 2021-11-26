pragma circom 2.0.0;

include "../functions/getMaze.circom";

template Maze() {
  signal output out[7][7];
  var maze[7][7] = getMaze();
  for (var y = 0; y < 7; y++) {
    for (var x = 0; x < 7; x++) {
      out[y][x] <-- maze[y][x];
    }
  }
}

component main = Maze();
