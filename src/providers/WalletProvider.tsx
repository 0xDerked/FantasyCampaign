import * as React from "react";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";

type WalletContextType = {
  signer: JsonRpcSigner | undefined;
};

export const WalletContext = React.createContext<WalletContextType | undefined>(
  undefined
);
