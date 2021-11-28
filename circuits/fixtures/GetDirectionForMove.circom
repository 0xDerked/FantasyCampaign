pragma circom 2.0.0;

include "../functions/getDirectionForMove.circom";

// FOR TESTING THE FUNCTION
template GetDirectionForMove() {
  signal input x1;
  signal input y1;
  signal input x2;
  signal input y2;
  signal output direction;
  var dir = getDirectionForMove(x1, y1, x2, y2);
  direction <-- dir;
}

component main {public [x1,y1,x2,y2]} = GetDirectionForMove();
