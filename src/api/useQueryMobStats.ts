import { useQuery } from "react-query";
import { GET_MOB_STATS_CACHE_KEY, getMobStats } from "./api";
import { useQuerySigner } from "./useQuerySigner";
import { useContracts } from "../hooks/useContracts";
import { useGameData } from "../hooks/useGameData";

export const useQueryMobStats = () => {
  const { data: signer } = useQuerySigner();
  const contracts = useContracts();
  const [gameData] = useGameData();
  const tokenId = gameData?.selectedTokenId;
  return useQuery(
    GET_MOB_STATS_CACHE_KEY,
    async () =>
      await getMobStats({
        contracts,
        signer,
        characterTokenId: tokenId!,
      }),
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: signer && typeof tokenId === "number",
    }
  );
};
