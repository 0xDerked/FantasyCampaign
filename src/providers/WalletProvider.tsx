import * as React from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";

type WalletContextType = {
  connectWallet: () => Promise<void>;
  signer: null | JsonRpcSigner;
};

export const WalletContext = React.createContext<WalletContextType | undefined>(
  undefined
);

export const WalletProvider: React.FC = ({ children }) => {
  const [signer, setSigner] = React.useState<null | JsonRpcSigner>(null);
  const connectWallet = useCallback(async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signerResponse = provider.getSigner();
    setSigner(signerResponse);
  }, []);

  const value = useMemo(() => {
    return {
      connectWallet,
      signer: signer,
    };
  }, [signer, connectWallet]);

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
