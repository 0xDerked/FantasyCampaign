import { useQuery } from "react-query";
import { FETCH_MINTED_CACHE_KEY, fetchAllMintedCharacters } from "./api";
import { useQuerySigner } from "./useQuerySigner";
import { useContracts } from "../hooks/useContracts";

export const useQueryAllMintedCharacters = () => {
  const { data: signer } = useQuerySigner();
  const contracts = useContracts();
  return useQuery(
    FETCH_MINTED_CACHE_KEY,
    async () =>
      await fetchAllMintedCharacters({
        contracts,
        signer,
      }),
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
};
