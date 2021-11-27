import { useEffect, useRef, useState } from "react";
import { GameModes } from "../types";
import { useGameData } from "./useGameData";
import { useQuerySigner } from "../api/useQuerySigner";
import { generateTurn, getTurnData } from "../api/api";
import { useContracts } from "./useContracts";
import { getGameModeFromTurnType } from "../utils/getGameModeFromTurnType";
import { useQueryPlayerStats } from "../api/useQueryPlayerStats";
import { X_FINAL, Y_FINAL } from "../constants";
import { generateProof } from "../utils/calculateProof";

const MOCK_CONTRACT = async (...args: any[]) => false;

export const useTriggerTurn = () => {
  const { data: signer } = useQuerySigner();
  const { data: playerData } = useQueryPlayerStats();
  const [gameData, setGameData] = useGameData();
  const { mode, position, moves, isGateOpen } = gameData;
  const tokenId = playerData?.tokenId;
  const contracts = useContracts();
  const { row, col } = position;

  const isInTurnMode = mode === GameModes.TurnTrigger;
  const wasInTurnMode = useRef<boolean | null>(null);

  const isAtGateTriggerPoint = col === X_FINAL && row === Y_FINAL;
  const isAtDragonTriggerPoint = col === X_FINAL && row === Y_FINAL + 1;
  console.log(isAtGateTriggerPoint, isAtDragonTriggerPoint);

  useEffect(() => {
    (async () => {
      if (!signer || typeof tokenId !== "number") {
        return;
      }

      // --------------------------------------------------------------------------------
      // Check whether user can open the gat
      if (isAtGateTriggerPoint) {
        const { publicSignals, proof } = await generateProof(moves);
        const contractSaysCanUnlock = await MOCK_CONTRACT(publicSignals, proof);
        if (contractSaysCanUnlock) {
          setGameData({ ...gameData, isGateOpen: true });
        } else {
          alert("You need the lance! Go loot some more");
        }
        return;
      }

      // --------------------------------------------------------------------------------
      // Check whether user can trigger the dragon

      if (isAtDragonTriggerPoint && isGateOpen) {
        const { publicSignals, proof } = await generateProof(moves);
        const contractSaysCanUnlock = await MOCK_CONTRACT(publicSignals, proof);
        if (contractSaysCanUnlock) {
          await getTurnData({
            signer,
            contracts,
            characterTokenId: tokenId,
          });
          setGameData({
            ...gameData,
            isRollingDice: true,
          });
        }
        alert("fight!");
        return;
      }

      // --------------------------------------------------------------------------------
      // Otherwise do a normal move

      if (isInTurnMode && !wasInTurnMode.current) {
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
        wasInTurnMode.current = isInTurnMode;
      }
    })();
  }, [isInTurnMode, tokenId, signer, isAtDragonTriggerPoint]);
};
