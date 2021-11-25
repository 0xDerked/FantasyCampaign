import { useCallback, useEffect } from "react";
import { useGameData } from "./useGameData";
import { useContracts } from "./useContracts";
import { BigNumber } from "ethers";
import { getTurnData } from "../api/api";
import { useWallet } from "./useWallet";
import { getGameModeFromTurnType } from "../utils/getGameModeFromTurnType";
import { useQueryMobStats } from "../api/useQueryMobStats";
import { useQueryPlayerStats } from "../api/useQueryPlayerStats";
import { GameModes } from "../types";

export const useContractListeners = () => {
  const [gameData, setGameData] = useGameData();
  const contracts = useContracts();
  const { signer } = useWallet();
  const { refetch: refetchMobStats } = useQueryMobStats();
  const { refetch: refetchPlayerStats } = useQueryPlayerStats();
  const { castleCampaignContract } = contracts;
  const playerTokenId = gameData?.selectedTokenId;

  const filterStarted =
    castleCampaignContract.filters.CampaignStarted(playerTokenId);
  const filterEnded =
    castleCampaignContract.filters.CampaignEnded(playerTokenId);
  const filterTurnSet = castleCampaignContract.filters.TurnSet(playerTokenId);
  const filterTurnStart =
    castleCampaignContract.filters.TurnStarted(playerTokenId);
  const filterTurnCompleted =
    castleCampaignContract.filters.TurnCompleted(playerTokenId);
  const filterCombat =
    castleCampaignContract.filters.CombatSequence(playerTokenId);

  const campaignStartedListener = useCallback((...args) => {
    console.log("campaignStartedListener");
  }, []);

  const campaignEndedListener = useCallback((...args) => {
    console.log("campaignEndedListener");
  }, []);

  const turnSetListener = useCallback((...args) => {
    console.log("turnSetListener");
  }, []);

  const turnStartedListener = useCallback(
    async (tokenId: BigNumber) => {
      const playerTokenId = gameData?.selectedTokenId;
      console.log("turnStartedListener", playerTokenId);
      if (signer && contracts && typeof playerTokenId === "number") {
        try {
          const turnType = await getTurnData({
            signer,
            contracts,
            characterTokenId: playerTokenId,
          });
          const gameMode = getGameModeFromTurnType(turnType);
          if (gameMode !== null)
            setGameData({
              ...gameData,
              mode: gameMode,
            });
        } catch (e: any) {
          alert(`Something went wrong: ${e.data?.message || e.message}`);
        }
      }
    },
    [gameData]
  );

  const turnCompletedListener = useCallback((...args) => {
    console.log("turnCompletedListener");
    setGameData({
      ...gameData,
      message: `All done`,
    });
    setTimeout(() => {
      setGameData({
        ...gameData,
        message: null,
        mode: GameModes.ExploringMaze,
      });
    }, 1000);
  }, []);

  const combatListener = useCallback(async (_, damage: number) => {
    console.log("combatListener", damage);
    await refetchMobStats();
    await refetchPlayerStats();
    setGameData({
      ...gameData,
      message: `You dealt ${damage} damage!`,
    });
  }, []);

  useEffect(() => {
    const filterStarted =
      castleCampaignContract.filters.CampaignStarted(playerTokenId);
    const filterEnded =
      castleCampaignContract.filters.CampaignEnded(playerTokenId);
    const filterTurnSet = castleCampaignContract.filters.TurnSet(playerTokenId);
    const filterTurnStart =
      castleCampaignContract.filters.TurnStarted(playerTokenId);
    const filterTurnCompleted =
      castleCampaignContract.filters.TurnCompleted(playerTokenId);
    const filterCombat =
      castleCampaignContract.filters.CombatSequence(playerTokenId);
    castleCampaignContract.on(filterStarted, campaignStartedListener);
    castleCampaignContract.on(filterEnded, campaignEndedListener);
    castleCampaignContract.on(filterTurnSet, turnSetListener);
    castleCampaignContract.on(filterTurnStart, turnStartedListener);
    castleCampaignContract.on(filterTurnCompleted, turnCompletedListener);
    castleCampaignContract.on(filterCombat, combatListener);
    return () => {
      castleCampaignContract.removeAllListeners(); //no event provided unsubscribes for all events
    };
  }, []);
};

export const ContractListeners = () => {
  useContractListeners();
  return null;
};
