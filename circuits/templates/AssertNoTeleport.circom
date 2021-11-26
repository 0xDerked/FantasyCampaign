pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template AssertNoTeleport() {
    signal input direction;
    signal input enabled;
    signal output out;
    signal tmp1;
    signal tmp2;
    component eq = ForceEqualIfEnabled();
    tmp1 <-- direction \ 99;
    tmp2 <-- 1 - tmp1;
    eq.enabled <== enabled;
    eq.in[0] <== 1 - (direction \ 99);
    eq.in[1] <== 1;
    out <== tmp2;
}
