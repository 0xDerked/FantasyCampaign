import { useQuery } from "react-query";
import { GET_PLAYER_STATS_CACHE_KEY, getPlayerStats } from "./api";
import { useQuerySigner } from "./useQuerySigner";
import { useContracts } from "../hooks/useContracts";
import { useGameData } from "../hooks/useGameData";

export const useQueryPlayerStats = () => {
  const { data: signer } = useQuerySigner();
  const contracts = useContracts();
  const [gameData] = useGameData();
  const tokenId = gameData?.selectedTokenId;
  return useQuery(
    GET_PLAYER_STATS_CACHE_KEY,
    async () =>
      await getPlayerStats({
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
