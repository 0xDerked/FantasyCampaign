pragma circom 2.0.0;

template Test() {
    signal input in1;
    signal input in2;
    signal output out;
    signal sum;
    sum <-- in1 + in2;
    out <== sum;
}
