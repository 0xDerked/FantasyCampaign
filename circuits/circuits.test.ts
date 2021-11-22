const path = require("path");
const { F1Field, Scalar } = require("ffjavascript");
exports.p = Scalar.fromString(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);

const Fr = new F1Field(exports.p);

const wasmTester = require("circom_tester").wasm;

describe("Circuit tests", () => {
  test("test circuit works works", async () => {
    const file = path.resolve(__dirname, "./circuit.circom");
    const circuit = await wasmTester(file);

    const witness = await circuit.calculateWitness({}, true);
    const input = Fr.e(1);
    const output = witness[0];
    expect(Fr.eq(input, output)).toBe(true);
  });
});
