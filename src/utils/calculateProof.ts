import * as snarkjs from "snarkjs";

import verificationKey from "../../circuits/verification_key.json";
import { genProof } from "./proofUtils";
const MAX_MOVES = 10;

export const calculateProof = async () => {
  console.log(verificationKey);
  const MAX_MOVES = 10;
  const OUT_OF_RANGE = [100, 100];

  const moves = Array(MAX_MOVES).fill(OUT_OF_RANGE); // Sparse array of moves
  [
    [0, 0],
    [0, 1],
    [2, 1],
    [10, 2],
    [100, 100],
    [100, 100],
    [100, 100],
    [100, 100],
    [100, 100],
    [100, 100],
  ].forEach((move, index) => {
    moves[index] = move;
  });
  const { proof, publicSignals } = await genProof(
    {
      moves: moves,
    },
    "http://localhost:3000/circuit.wasm",
    "http://localhost:3000/circuit_final.key"
  );

  const res = await snarkjs.groth16.verify(
    verificationKey,
    publicSignals,
    proof
  );
  console.log(res, publicSignals);
};
