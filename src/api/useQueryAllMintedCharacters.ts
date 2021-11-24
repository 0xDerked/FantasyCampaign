import { useQuery } from "react-query";
import { FETCH_MINTED_CACHE_KEY, fetchAllMintedCharacters } from "./api";
import { useWallet } from "../hooks/useWallet";

export const useQueryAllMintedCharacters = () => {
  const { signer } = useWallet();
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
