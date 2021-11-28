import * as React from "react";
import { ReactNode, useMemo } from "react";
import { useQuerySigner } from "../api/useQuerySigner";
import { WalletContext } from "../providers/WalletProvider";
import { GameViewPort } from "../Maze/EnvironmentTextures";
import { AbsoluteCenterFill } from "../components/Layout";

export const Web3Gate = ({ children }: { children: ReactNode }) => {
  const { data: signer } = useQuerySigner();
  const value = useMemo(() => {
    return {
      signer: signer,
    };
  }, [signer]);
  if (!signer) {
    return (
      <GameViewPort>
        <AbsoluteCenterFill>Loading...</AbsoluteCenterFill>
      </GameViewPort>
    );
  }
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
