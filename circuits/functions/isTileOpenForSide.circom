pragma circom 2.0.0;

function isTileOpenForSide(tileCode, side) {
  // tileCode: [1..16]

  // side:
  // 0 - top
  // 1 - right
  // 2 - bottom
  // 3 - left

  var    topOpen[8] = [ 0, 1, 2, 4, 5,  8, 12, 14];
  var bottomOpen[8] = [ 0, 2, 3, 6, 7, 10, 12, 14];
  var   leftOpen[8] = [ 0, 1, 3, 4, 7, 13, 14, 14]; // extra 14 to keep the array size constant
  var  rightOpen[8] = [ 1, 2, 3, 5, 6, 9, 13, 14];
  var sides[4][8] = [
    topOpen,
    rightOpen,
    bottomOpen,
    leftOpen
  ];
  var allowed[8] = sides[side];

  var s = 0;
  var i;
  for (i=0; i < 8; i++) {
    var allowedFromType = allowed[i];
    if (allowedFromType == tileCode) {
      s = 1;
    }
  }
  return s;
}
