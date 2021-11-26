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

  const turnStartedListener = useCallback(
    async (tokenId: BigNumber) => {
      const playerTokenId = gameData?.selectedTokenId;
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
        isRollingDice: false,
      });
    }, 1000);
  }, []);

  const combatListener = useCallback(async (_, damage: number) => {
    console.log("combatListener", damage);
    // Prevent combatListener from being called when in a non-combat mode
    if (gameData.mode === GameModes.InCombat) {
      await refetchMobStats();
      await refetchPlayerStats();
      setGameData({
        ...gameData,
        message: `You dealt ${damage} damage!`,
        isRollingDice: false,
      });
    }
  }, []);

  const campaignEndedListener = useCallback(async (_, damage: number) => {
    console.log("campaignEndedListener");
    setGameData({
      ...gameData,
      message: null,
      mode: GameModes.End,
      isRollingDice: false,
    });
  }, []);

  useEffect(() => {
    // const filterStarted = castleCampaignContract.filters.CampaignStarted(playerTokenId);
    const filterEnded =
      castleCampaignContract.filters.CampaignEnded(playerTokenId);
    // const filterTurnSet = castleCampaignContract.filters.TurnSet(playerTokenId);
    // eslint-disable-next-line prettier/prettier
    const filterTurnStart = castleCampaignContract.filters.TurnStarted(playerTokenId);
    // eslint-disable-next-line prettier/prettier
    const filterTurnCompleted = castleCampaignContract.filters.TurnCompleted(playerTokenId);
    // eslint-disable-next-line prettier/prettier
    const filterCombat = castleCampaignContract.filters.CombatSequence(playerTokenId);
    // castleCampaignContract.on(filterStarted, campaignStartedListener);
    castleCampaignContract.on(filterEnded, campaignEndedListener);
    // castleCampaignContract.on(filterTurnSet, turnSetListener);
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
