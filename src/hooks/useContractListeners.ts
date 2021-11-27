import { useCallback, useEffect, useRef } from "react";
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
  const lastGameMode = useRef<GameModes>(gameData.mode);

  useEffect(() => {
    lastGameMode.current = gameData.mode;
  }, [gameData.mode]);

  const turnSetListener = useCallback(() => {
    console.log("turnSetListener");
    setGameData({
      ...gameData,
      isRollingDice: true,
    });
  }, [gameData]);

  const turnStartedListener = useCallback(
    async (tokenId: BigNumber) => {
      console.log("turnStartedListener");
      const playerTokenId = gameData?.selectedTokenId;
      if (signer && contracts && typeof playerTokenId === "number") {
        try {
          const turnType = await getTurnData({
            signer,
            contracts,
            characterTokenId: playerTokenId,
          });
          const gameMode = getGameModeFromTurnType(turnType);
          if (gameMode !== null) {
            setGameData({
              ...gameData,
              mode: gameMode,
              isRollingDice: false,
            });
            lastGameMode.current = gameMode;
          }
        } catch (e: any) {
          alert(`Something went wrong: ${e.data?.message || e.message}`);
        }
      }
    },
    [gameData]
  );

  const turnCompletedListener = useCallback(
    (...args) => {
      console.log("turnCompletedListener");
      setGameData({
        ...gameData,
        mode: GameModes.ExploringMaze,
        isRollingDice: false,
      });
      lastGameMode.current = GameModes.ExploringMaze;
    },
    [gameData]
  );

  const combatListener = useCallback(
    async (_, damage: number) => {
      console.log("combatListener", damage);
      // Prevent combatListener from being called when in a non-combat mode
      if (lastGameMode.current === GameModes.InCombat) {
        await refetchMobStats();
        await refetchPlayerStats();
        setGameData({
          ...gameData,
          message: `You dealt ${damage} damage!`,
          isRollingDice: false,
        });
      }
    },
    [gameData]
  );

  const campaignEndedListener = useCallback(
    async (_, damage: number) => {
      console.log("campaignEndedListener");
      setGameData({
        ...gameData,
        message: null,
        mode: GameModes.End,
        isRollingDice: false,
      });
      lastGameMode.current = GameModes.End;
    },
    [gameData]
  );

  useEffect(() => {
    // const filterStarted = castleCampaignContract.filters.CampaignStarted(playerTokenId);
    const filterEnded =
      castleCampaignContract.filters.CampaignEnded(playerTokenId);
    const filterTurnSet = castleCampaignContract.filters.TurnSet(playerTokenId);
    const filterTurnStart =
      castleCampaignContract.filters.TurnStarted(playerTokenId);
    const filterTurnCompleted =
      castleCampaignContract.filters.TurnCompleted(playerTokenId);
    const filterCombat =
      castleCampaignContract.filters.CombatSequence(playerTokenId);
    // castleCampaignContract.on(filterStarted, campaignStartedListener);
    castleCampaignContract.on(filterEnded, campaignEndedListener);
    castleCampaignContract.on(filterTurnSet, turnSetListener); // <-- turn set after the random oracle
    castleCampaignContract.on(filterTurnStart, turnStartedListener); // <-- User has asked for a turn
    castleCampaignContract.on(filterTurnCompleted, turnCompletedListener);
    castleCampaignContract.on(filterCombat, combatListener);
    return () => {
      castleCampaignContract.removeAllListeners(); //no event provided unsubscribes for all events
    };
  }, [gameData.mode]);
};

export const ContractListeners = () => {
  useContractListeners();
  return null;
};
