import { useEffect, useRef } from "react";
import { GameModes } from "../types";
import { useGameData } from "./useGameData";
import { useQuerySigner } from "../api/useQuerySigner";
import { generateTurn } from "../api/api";

export const useTriggerTurn = () => {
  const { data: signer } = useQuerySigner();
  const [gameData] = useGameData();
  const { selectedTokenId, mode } = gameData;

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
          await generateTurn(signer, selectedTokenId);
          wasInTurnMode.current = isInTurnMode;
        } catch (e: any) {
          alert(`Failed to trigger turn ${e.data?.message || e.message}`);
        }
      }
    })();
  }, [isInTurnMode, selectedTokenId, signer]);
};
