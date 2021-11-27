import { useQuery } from "react-query";
import { MOVE_IS_FINAL_CACHE_KEY, moveIsFinal } from "./api";
import { useQuerySigner } from "./useQuerySigner";
import { useContracts } from "../hooks/useContracts";
import { useGameData } from "../hooks/useGameData";

export const useQueryMoveIsFinal = () => {
  const { data: signer } = useQuerySigner();
  const contracts = useContracts();
  const [gameData] = useGameData();
  const tokenId = gameData?.selectedTokenId;
  return useQuery(
    MOVE_IS_FINAL_CACHE_KEY,
    async () =>
      await moveIsFinal({
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
