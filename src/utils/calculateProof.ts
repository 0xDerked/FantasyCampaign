import * as snarkjs from "snarkjs";

import verificationKey from "../../circuits/verification_key.json";
import { genProof } from "./proofUtils";
import { Position } from "../types";
const MAX_MOVES = 200;
const OUT_OF_RANGE = [100, 100];

export const calculateProof = async (
  moves: Position[]
): Promise<{ proofVerifies: boolean; answerCorrect: boolean }> => {
  const paddedMoves = Array(MAX_MOVES).fill(OUT_OF_RANGE); // Sparse array of moves
  moves.forEach(({ col, row }, index) => {
    paddedMoves[index] = [col, row];
  });
  const { proof, publicSignals } = await genProof(
    {
      moves: paddedMoves,
    },
    "http://localhost:3000/circuit.wasm",
    "http://localhost:3000/circuit_final.key"
  );

  const res = await snarkjs.groth16.verify(
    verificationKey,
    publicSignals,
    proof
  );
  return {
    proofVerifies: res,
    answerCorrect: publicSignals[0] === "1" && publicSignals[1] === "1",
  };
};
