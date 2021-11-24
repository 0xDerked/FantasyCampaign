import * as React from "react";
import { ReactNode } from "react";
import { useQuerySigner } from "../api/useQuerySigner";

export const Web3Gate = ({ children }: { children: ReactNode }) => {
  const { data: signer } = useQuerySigner();
  if (!signer) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
};
