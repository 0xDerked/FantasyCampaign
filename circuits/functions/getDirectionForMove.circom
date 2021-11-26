pragma circom 2.0.0;

function getDirectionForMove(x1, y1, x2, y2) {
  var xDiff = x2 - x1;
  var yDiff = y2 - y1;

  // direction
  // 0 - north
  // 1 - east
  // 2 - south
  // 3 - west
  var direction;
  if (xDiff == -1) {
    direction = 3;
  }
  if (xDiff == 1) {
    direction = 1;
  }
  if (yDiff == -1) {
    direction = 0;
  }
  if (yDiff == 1) {
    direction = 2;
  }
  return direction;
}
