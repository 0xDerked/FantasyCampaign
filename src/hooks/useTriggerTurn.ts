import { useEffect, useRef } from "react";
import { GameModes } from "../types";
import { useGameData } from "./useGameData";
import { useQuerySigner } from "../api/useQuerySigner";
import { generateTurn, getTurnData } from "../api/api";
import { useContracts } from "./useContracts";
import { getGameModeFromTurnType } from "../utils/getGameModeFromTurnType";

export const useTriggerTurn = () => {
  const { data: signer } = useQuerySigner();
  const [gameData, setGameData] = useGameData();
  const { selectedTokenId, mode } = gameData;
  const contracts = useContracts();

  const isInTurnMode = mode === GameModes.TurnTrigger;
  const wasInTurnMode = useRef<boolean | null>(null);

  useEffect(() => {
    (async () => {
      if (
        isInTurnMode &&
        !wasInTurnMode.current &&
        signer &&
        typeof selectedTokenId === "number"
      ) {
        try {
          const turnType = await getTurnData({
            signer,
            contracts,
            characterTokenId: selectedTokenId,
          });
          if (turnType === 0) {
            // Only generate a turn if not currently in one.
            setGameData({
              ...gameData,
              mode: GameModes.ExploringMaze,
              message: "Something mysterious is happening...",
            });
            await generateTurn({
              signer,
              contracts,
              characterTokenId: selectedTokenId,
            });
          } else {
            // Just set the game mode as the listener won't be called
            const gameMode = getGameModeFromTurnType(turnType);
            if (gameMode === null) {
              setGameData({
                ...gameData,
                mode: GameModes.ExploringMaze,
                message: null,
              });
            } else {
              setGameData({
                ...gameData,
                mode: gameMode,
                message: null,
              });
            }
          }
          wasInTurnMode.current = isInTurnMode;
        } catch (e: any) {
          alert(`Failed to trigger turn ${e.data?.message || e.message}`);
        }
      }
    })();
  }, [isInTurnMode, selectedTokenId, signer]);
};
