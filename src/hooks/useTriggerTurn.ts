import { useEffect, useRef, useState } from "react";
import { GameModes } from "../types";
import { useGameData } from "./useGameData";
import { useQuerySigner } from "../api/useQuerySigner";
import { generateTurn, getTurnData, unlockFinalTurn } from "../api/api";
import { useContracts } from "./useContracts";
import { getGameModeFromTurnType } from "../utils/getGameModeFromTurnType";
import { useQueryPlayerStats } from "../api/useQueryPlayerStats";
import { X_FINAL, Y_FINAL } from "../constants";
import { calculateProof, generateProof } from "../utils/calculateProof";
import { useQueryMoveIsFinal } from "../api/useQueryMoveIsFinal";
import { usePosition } from "./usePosition";

export const useTriggerTurn = () => {
  const { data: signer } = useQuerySigner();
  const { data: playerData } = useQueryPlayerStats();
  const [gameData, setGameData] = useGameData();
  const { data: isFinalTurn } = useQueryMoveIsFinal();
  const { mode, moves, isGateOpen } = gameData;
  const tokenId = playerData?.tokenId;
  const contracts = useContracts();
  const position = usePosition();
  const { row, col } = position;

  const isInTurnMode = mode === GameModes.TurnTrigger;
  const wasInTurnMode = useRef<boolean | null>(null);

  const isAtGateTriggerPoint = col === X_FINAL && row === Y_FINAL;
  const isAtDragonTriggerPoint = col === X_FINAL && row === Y_FINAL + 1;

  useEffect(() => {
    if (!isInTurnMode) {
      wasInTurnMode.current = false;
      return;
    }
  }, [isInTurnMode]);

  useEffect(() => {
    (async () => {
      if (!signer || typeof tokenId !== "number") {
        return;
      }

      // --------------------------------------------------------------------------------
      // Check whether user can open the gate. If so, open it. We'll trust the user for
      // now but verify the proof in the smart contract at the next step

      if (isAtGateTriggerPoint && !isGateOpen && isFinalTurn) {
        console.log("Maybe unlocking gate");
        const { answerCorrect } = await calculateProof(moves);
        if (answerCorrect) {
          setGameData({ ...gameData, isGateOpen: true });
        } else {
          alert("Hmn... Something wrong with your steps");
        }
        return;
      }

      // Only trigger this when the player has started turn mode
      if (!isInTurnMode) {
        return;
      }
      if (!(isInTurnMode && !wasInTurnMode.current)) {
        return;
      }

      // --------------------------------------------------------------------------------
      // Check whether user can trigger the dragon

      if (isAtDragonTriggerPoint && isGateOpen && isFinalTurn) {
        console.log("Maybe unlocking dragon");
        const { publicSignals, proof } = await generateProof(moves);
        try {
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
          setGameData({
            ...gameData,
            isRollingDice: true,
          });
        } catch (e) {
          // Throw means they've checked
          alert("Hmn... how did you get here exactly? 🤔");
        }
        return;
      }

      // --------------------------------------------------------------------------------
      // Otherwise do a normal move

      const turnType = await getTurnData({
        signer,
        contracts,
        characterTokenId: tokenId,
      });
      if (turnType === 0) {
        // Only generate a turn if not currently in one.
        setGameData({
          ...gameData,
          mode: GameModes.ExploringMaze,
          message: null,
          isRollingDice: true,
        });
        await generateTurn({
          signer,
          contracts,
          characterTokenId: tokenId,
        });
      } else {
        // Just set the game mode as the listener won't be called
        const gameMode = getGameModeFromTurnType(turnType);
        if (gameMode === null) {
          setGameData({
            ...gameData,
            mode: GameModes.ExploringMaze,
            message: null,
            isRollingDice: false,
          });
        } else {
          setGameData({
            ...gameData,
            mode: gameMode,
            message: null,
            isRollingDice: false,
          });
        }
      }
    })();
  }, [
    contracts,
    gameData,
    isAtDragonTriggerPoint,
    isAtGateTriggerPoint,
    isFinalTurn,
    isGateOpen,
    isInTurnMode,
    moves,
    setGameData,
    signer,
    tokenId,
  ]);
};
