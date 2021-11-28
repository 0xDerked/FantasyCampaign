import { useEffect, useRef } from "react";
import { GameModes } from "../types";
import { useGameData } from "./useGameData";
import { useQuerySigner } from "../api/useQuerySigner";
import { generateTurn, getTurnData, unlockFinalTurn } from "../api/api";
import { useContracts } from "./useContracts";
import { getGameModeFromTurnType } from "../utils/getGameModeFromTurnType";
import { useQueryPlayerStats } from "../api/useQueryPlayerStats";
import { calculateProof, generateProof } from "../utils/calculateProof";
import { useQueryMoveIsFinal } from "../api/useQueryMoveIsFinal";
import { usePosition } from "./usePosition";
import {
  isAtDragonTrigger,
  isAtGateTrigger,
  isSpawnPointAndUnused,
} from "../utils/generateCollisionMaps";

export const useHandleTriggerPoints = () => {
  const { data: signer } = useQuerySigner();
  const { data: playerData } = useQueryPlayerStats();
  const { data: isFinalTurn } = useQueryMoveIsFinal();
  const [gameData, setGameData] = useGameData();
  const contracts = useContracts();
  const position = usePosition();
  const { moves, isGateOpen, isRollingDice, spawnPoints } = gameData;
  const tokenId = playerData?.tokenId;

  const wasRollingDice = useRef(isRollingDice);
  const isAtUnusedSpawnPoint = isSpawnPointAndUnused(position, spawnPoints);
  const isAtGateTriggerPoint = isAtGateTrigger(position);
  const isAtDragonTriggerPoint = isAtDragonTrigger(position);

  useEffect(() => {
    if (!isRollingDice) {
      // Note: this is (mostly) only cleared by the listeners
      wasRollingDice.current = false;
    }
  }, [isRollingDice]);

  useEffect(() => {
    (async () => {
      if (!signer || typeof tokenId !== "number") {
        return;
      }

      // Don't do any async stuff if something is already happening
      if (isRollingDice || wasRollingDice.current) {
        return;
      }

      // --------------------------------------------------------------------------------
      // Check whether user can open the gate. If so, open it. We'll trust the user for
      // now but verify the proof in the smart contract at the next step

      if (isAtGateTriggerPoint && !isGateOpen && isFinalTurn) {
        console.log("Maybe unlocking gate");
        wasRollingDice.current = true;
        const { answerCorrect } = await calculateProof(moves);
        if (answerCorrect) {
          setGameData({ ...gameData, isGateOpen: true });
        } else {
          alert("Hmn... Something wrong with your steps");
        }
        wasRollingDice.current = false; // Manually clear this as we're not using the listener
        return;
      }

      // --------------------------------------------------------------------------------
      // Check whether user can trigger the dragon

      if (isAtDragonTriggerPoint && isGateOpen && isFinalTurn) {
        console.log("Maybe unlocking dragon");
        try {
          wasRollingDice.current = true;
          setGameData({ ...gameData, isRollingDice: true });
          const { publicSignals, proof } = await generateProof(moves);
          // Send the proof to the contract to unlock the final turn.
          // Throws if the proof is invalid
          await unlockFinalTurn({
            characterTokenId: tokenId,
            contracts,
            proof,
            publicSignals,
            signer,
          });
          await generateTurn({
            signer,
            contracts,
            characterTokenId: tokenId,
          });
        } catch (e: any) {
          alert(`Error unlocking dragon: ${e.data?.message || e.message}`);
        }
        return;
      }

      // --------------------------------------------------------------------------------
      // Otherwise if we're at a spawn point, generate a new turn

      if (!isAtUnusedSpawnPoint) {
        return;
      }

      console.log("Maybe triggering new turn");

      const turnType = await getTurnData({
        signer,
        contracts,
        characterTokenId: tokenId,
      });
      if (turnType === 0) {
        // Only generate a turn if not currently in one.
        setGameData({
          ...gameData,
          isRollingDice: true,
        });
        wasRollingDice.current = true;
        await generateTurn({
          signer,
          contracts,
          characterTokenId: tokenId,
        });
        return;
      }
      // Just set the game mode synchronously as the listener won't be called
      const gameMode = getGameModeFromTurnType(turnType);
      console.log("Non-zero turn type", turnType);
      if (gameMode !== null) {
        setGameData({
          ...gameData,
          mode: gameMode,
          isRollingDice: false,
        });
        return;
      }
      // Else fall back to exploring maze
      setGameData({
        ...gameData,
        mode: GameModes.ExploringMaze,
        isRollingDice: false,
      });
    })();
  }, [
    contracts,
    gameData,
    isAtDragonTriggerPoint,
    isAtGateTriggerPoint,
    isRollingDice,
    isFinalTurn,
    isGateOpen,
    isAtUnusedSpawnPoint,
    moves,
    setGameData,
    signer,
    tokenId,
  ]);
};
