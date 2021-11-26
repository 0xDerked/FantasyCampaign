pragma circom 2.0.0;

include "./getMaze.circom";

function getTileCodeFromCoords(x,y) {
  var maze[7][7] = getMaze();
  var tileCode = maze[y][x];
  return tileCode;
}
