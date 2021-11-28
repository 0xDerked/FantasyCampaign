const snarkjs = require("snarkjs");
const path = require("path");
const { genProof } = require("./proofUtils");

const calculateProof = async () => {
  const { proof, publicSignals } = await genProof(
    {
      moves: [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 2],
        [100, 100],
      ],
    },
    path.resolve(__dirname, "./circuit_js/circuit.wasm"),
    path.resolve(__dirname, "./circuit_final.key")
  );
  console.log(proof);
};

calculateProof().then();
