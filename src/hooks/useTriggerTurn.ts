import { useEffect, useRef } from "react";
import { Routes } from "../types";
import { useGameData } from "./useGameData";

const contractMock = {
  async generateTurn() {
    //
  },
};

export const useTriggerTurn = () => {
  const [gameState] = useGameData();
  const isInTurnMode = gameState.route === Routes.Turn;
  const wasInTurnMode = useRef<boolean | null>(null);

  useEffect(() => {
    (async () => {
      if (isInTurnMode && !wasInTurnMode.current) {
        await contractMock.generateTurn();
      }
    })();
    wasInTurnMode.current = isInTurnMode;
  }, [isInTurnMode]);
};
