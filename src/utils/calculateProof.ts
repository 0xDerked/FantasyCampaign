import * as snarkjs from "snarkjs";

import verificationKey from "../../circuits/verification_key.json";
import { genProof } from "./proofUtils";

export const calculateProof = async () => {
  console.log(verificationKey);
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
    "http://localhost:3000/circuit.wasm",
    "http://localhost:3000/circuit_final.key"
  );

  const res = await snarkjs.groth16.verify(
    verificationKey,
    publicSignals,
    proof
  );
  console.log(res);
};
