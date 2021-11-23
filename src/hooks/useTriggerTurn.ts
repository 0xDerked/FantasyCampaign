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
  const isFighting = gameState.route === Routes.Fight;

  const wasFighting = useRef(isFighting);
  useEffect(() => {
    if (isFighting && !wasFighting.current) {
      (async () => {
        await contractMock.generateTurn();
      })();
    }
    wasFighting.current = isFighting;
  }, [isFighting]);
};
