import * as React from "react";
import { WalletContext } from "../providers/WalletProvider";

export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};
