import * as React from "react";
import { Contracts, ContractsContext } from "../providers/ContractsProvider";

export const useContracts = (): Contracts => {
  const context = React.useContext(ContractsContext);
  if (context === undefined) {
    throw new Error(
      "useContractsContext must be used within a ContractsProvider"
    );
  }
  return context as Contracts;
};
