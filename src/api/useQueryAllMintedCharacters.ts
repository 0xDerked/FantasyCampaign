import { useQuery } from "react-query";
import { FETCH_MINTED_CACHE_KEY, fetchAllMintedCharacters } from "./api";
import { useQuerySigner } from "./useQuerySigner";

export const useQueryAllMintedCharacters = () => {
  const { data: signer } = useQuerySigner();
  return useQuery(
    FETCH_MINTED_CACHE_KEY,
    async () => await fetchAllMintedCharacters(signer),
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
};
