import * as snarkjs from "snarkjs";
import builder from "../../circuits/circuit_js/witness_calculator";

export const genWnts = async (
  input: any,
  wasmFilePath: string
): Promise<any> => {
  let wntsBuff: ArrayBuffer;
  const resp = await fetch(wasmFilePath);
  wntsBuff = await resp.arrayBuffer();

  return new Promise((resolve, reject) => {
    builder(wntsBuff)
      .then(async witnessCalculator => {
        const buff = await witnessCalculator.calculateWTNSBin(input, 0);
        resolve(buff);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const genProof = async (
  grothInput: any,
  wasmFilePath: string,
  finalZkeyPath: string
) => {
  let zkeyBuff: ArrayBuffer;
  const wtnsBuff = await genWnts(grothInput, wasmFilePath);
  //window exists only in browser
  const resp = await fetch(finalZkeyPath);
  zkeyBuff = await resp.arrayBuffer();

  const { proof, publicSignals } = await snarkjs.groth16.prove(
    new Uint8Array(zkeyBuff),
    wtnsBuff,
    null
  );
  return { proof, publicSignals };
};

export const verifyProof = (vKey: string, fullProof: any) => {
  const { proof, publicSignals } = fullProof;
  return snarkjs.groth16.verify(vKey, publicSignals, proof);
};
