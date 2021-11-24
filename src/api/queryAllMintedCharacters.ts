import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";
import { queryClient } from "../App";
import { FETCH_MINTED_CACHE_KEY, fetchAllMintedCharacters } from "./api";

export const queryAllMintedCharacters = (signer: JsonRpcSigner) => {
  return queryClient.fetchQuery(FETCH_MINTED_CACHE_KEY, async () => {
    await fetchAllMintedCharacters(signer);
  });
};
