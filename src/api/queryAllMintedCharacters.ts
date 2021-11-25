import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";
import { queryClient } from "../App";
import { FETCH_MINTED_CACHE_KEY, fetchAllMintedCharacters } from "./api";
import { useContracts } from "../hooks/useContracts";

export const queryAllMintedCharacters = (signer: JsonRpcSigner) => {
  const contracts = useContracts();
  return queryClient.fetchQuery(FETCH_MINTED_CACHE_KEY, async () => {
    await fetchAllMintedCharacters({
      contracts,
      signer,
    });
  });
};
