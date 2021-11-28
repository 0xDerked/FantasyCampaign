pragma circom 2.0.0;

include "../templates/AssertNoTeleport.circom";

// FOR TESTING THE FUNCTION
template AssertNoTeleportTest() {
  signal input direction;
  signal input enabled;
  signal output out;
  component a = AssertNoTeleport();
  a.direction <== direction;
  a.enabled <== enabled;
  out <== a.out;
}

component main {public [direction, enabled]} = AssertNoTeleportTest();
