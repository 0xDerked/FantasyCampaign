import { useQuery } from "react-query";
import { FETCH_SIGNER_CACHE_KEY, fetchSigner } from "./api";

export const useQuerySigner = () => {
  return useQuery(FETCH_SIGNER_CACHE_KEY, async () => await fetchSigner());
};
