import * as React from "react";
import { ReactNode, useMemo } from "react";
import { useQuerySigner } from "../api/useQuerySigner";
import { WalletContext } from "../providers/WalletProvider";

export const Web3Gate = ({ children }: { children: ReactNode }) => {
  const { data: signer } = useQuerySigner();
  const value = useMemo(() => {
    return {
      signer: signer,
    };
  }, [signer]);
  if (!signer) {
    return <div>Loading...</div>;
  }
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
