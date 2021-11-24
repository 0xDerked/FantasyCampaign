import * as React from "react";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";
import { ReactNode, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

export const Web3Gate = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = React.useState<null | JsonRpcSigner>(null);
  useEffect(() => {
    (async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signerResponse = provider.getSigner();
      setSigner(signerResponse);
    })();
  }, []);
  if (!signer) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
};
