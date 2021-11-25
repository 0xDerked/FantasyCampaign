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
  const { selectedTokenId } = gameData;
  const contracts = useContracts();
  const { signer } = useWallet();
  const { refetch: refetchMobStats } = useQueryMobStats();
  const { refetch: refetchPlayerStats } = useQueryPlayerStats();
  const { castleCampaignContract } = contracts;

  const filterStarted =
    castleCampaignContract.filters.CampaignStarted(selectedTokenId);
  const filterEnded =
    castleCampaignContract.filters.CampaignEnded(selectedTokenId);
  const filterTurnSet = castleCampaignContract.filters.TurnSet(selectedTokenId);
  const filterTurnStart =
    castleCampaignContract.filters.TurnStarted(selectedTokenId);
  const filterTurnCompleted =
    castleCampaignContract.filters.TurnCompleted(selectedTokenId);
  const filterCombat =
    castleCampaignContract.filters.CombatSequence(selectedTokenId);

  const campaignStartedListener = useCallback((...args) => {
    console.log("campaignStartedListener");
  }, []);

  const campaignEndedListener = useCallback((...args) => {
    console.log("campaignEndedListener");
  }, []);

  const turnSetListener = useCallback((...args) => {
    console.log("turnSetListener");
  }, []);

  const turnStartedListener = useCallback(async (tokenId: BigNumber) => {
    console.log("turnSetListener");
    if (signer && contracts && typeof selectedTokenId === "number") {
      try {
        const turnType = await getTurnData({
          signer,
          contracts,
          characterTokenId: selectedTokenId,
        });
        const gameMode = getGameModeFromTurnType(turnType);
        if (gameMode !== null)
          setGameData({
            ...gameData,
            mode: gameMode,
          });
      } catch (e: any) {
        alert(`Something went wrong: ${e.message}`);
      }
    }
  }, []);

  const turnCompletedListener = useCallback((...args) => {
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
    setTimeout(() => {
      setGameData({
        ...gameData,
        message: null,
      });
    }, 1000);
  }, []);

  useEffect(() => {
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
