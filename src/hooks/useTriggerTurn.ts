import { useEffect, useRef } from "react";
import { Routes } from "../types";
import { useGameData } from "./useGameData";
import { useQuerySigner } from "../api/useQuerySigner";
import { generateTurn } from "../api/api";

export const useTriggerTurn = () => {
  const { data: signer } = useQuerySigner();
  const [gameData] = useGameData();
  const { selectedTokenId, route } = gameData;

  const isInTurnMode = route === Routes.Turn;
  const wasInTurnMode = useRef<boolean | null>(null);

  useEffect(() => {
    (async () => {
      if (
        isInTurnMode &&
        !wasInTurnMode.current &&
        signer &&
        typeof selectedTokenId === "number"
      ) {
        await generateTurn(signer, selectedTokenId);
      }
    })();
    wasInTurnMode.current = isInTurnMode;
  }, [isInTurnMode, selectedTokenId, signer]);
};
