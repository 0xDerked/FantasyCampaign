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
import { usePosition } from "./usePosition";

export const useContractListeners = () => {
  const [gameData, setGameData] = useGameData();
  const contracts = useContracts();
  const { signer } = useWallet();
  const { refetch: refetchMobStats } = useQueryMobStats();
  const { refetch: refetchPlayerStats } = useQueryPlayerStats();
  const position = usePosition();
  const { castleCampaignContract } = contracts;
  const playerTokenId = gameData.selectedTokenId;
  const { spawnPoints } = gameData;

  // --------------------------------------------------------------------------------

  const turnSetListener = useCallback(
    async (tokenId: BigNumber) => {
      console.log("turnSetListener");
      if (signer && contracts && typeof playerTokenId === "number") {
        try {
          const turnType = await getTurnData({
            signer,
            contracts,
            characterTokenId: playerTokenId,
          });
          const gameMode = getGameModeFromTurnType(turnType);
          console.log("new game mode:", gameMode, turnType);
          if (gameMode !== null) {
            setGameData({
              ...gameData,
              mode: gameMode,
              isRollingDice: false,
            });
          }
        } catch (e: any) {
          alert(`Something went wrong: ${e.data?.message || e.message}`);
        }
      }
    },
    [contracts, gameData, playerTokenId, setGameData, signer]
  );

  // --------------------------------------------------------------------------------

  const turnCompletedListener = useCallback(
    (...args) => {
      console.log("turnCompletedListener");
      const { row, col } = position;
      // Clear the point
      const newSpawnPoints = spawnPoints.map(point => {
        const isCurrentPoint = point.y === row && point.x === col;
        if (isCurrentPoint) {
          return {
            ...point,
            isUsed: true,
          };
        }
        return point;
      });
      setGameData({
        ...gameData,
        mode: GameModes.ExploringMaze,
        spawnPoints: newSpawnPoints,
        isRollingDice: false,
      });
    },
    [gameData, position, setGameData, spawnPoints]
  );

  // --------------------------------------------------------------------------------

  const combatListener = useCallback(
    async (_, damage: number) => {
      console.log("combatListener", damage);
      // Prevent combatListener from being called when in a non-combat mode
      await refetchMobStats();
      await refetchPlayerStats();
      setGameData({
        ...gameData,
        isRollingDice: false,
      });
    },
    [gameData, refetchMobStats, refetchPlayerStats, setGameData]
  );

  // --------------------------------------------------------------------------------

  const campaignEndedListener = useCallback(
    async (_, damage: number) => {
      console.log("campaignEndedListener");
      setGameData({
        ...gameData,
        mode: GameModes.End,
        isRollingDice: false,
      });
    },
    [gameData, setGameData]
  );

  // --------------------------------------------------------------------------------

  useEffect(() => {
    const filterEnded =
      castleCampaignContract.filters.CampaignEnded(playerTokenId);
    const filterTurnSet = castleCampaignContract.filters.TurnSet(playerTokenId);
    const filterTurnCompleted =
      castleCampaignContract.filters.TurnCompleted(playerTokenId);
    const filterCombat =
      castleCampaignContract.filters.CombatSequence(playerTokenId);
    castleCampaignContract.on(filterEnded, campaignEndedListener);
    castleCampaignContract.on(filterTurnSet, turnSetListener); // <-- turn set after the random oracle
    castleCampaignContract.on(filterTurnCompleted, turnCompletedListener);
    castleCampaignContract.on(filterCombat, combatListener);
    return () => {
      castleCampaignContract.removeAllListeners(); //no event provided unsubscribes for all events
    };
  }, [
    campaignEndedListener,
    castleCampaignContract,
    combatListener,
    playerTokenId,
    turnCompletedListener,
    turnSetListener,
  ]);
};

export const ContractListeners = () => {
  useContractListeners();
  return null;
};
