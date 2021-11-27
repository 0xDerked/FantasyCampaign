import * as snarkjs from "snarkjs";

import verificationKey from "../../circuits/verification_key.json";
import { genProof } from "./snarkUtils";
import { Position } from "../types";
const MAX_MOVES = 200;
const OUT_OF_RANGE = [100, 100];

export const generateProof = async (
  moves: Position[]
): Promise<{ proof: any; publicSignals: [string, string] }> => {
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
  return { proof, publicSignals };
};

export const calculateProof = async (
  moves: Position[]
): Promise<{ proofVerifies: boolean; answerCorrect: boolean }> => {
  const { publicSignals, proof } = await generateProof(moves);
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

export const buildContractCallArgs = (
  proof: any,
  publicSignals: [string, string]
) => {
  return [
    proof.pi_a.slice(0, 2),
    [proof.pi_b[0].slice(0).reverse(), proof.pi_b[1].slice(0).reverse()],
    proof.pi_c.slice(0, 2),
    publicSignals,
  ];
};
