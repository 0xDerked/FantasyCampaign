import { useEffect, useRef } from "react";
import { useGameData } from "../providers/GameData";
import { Routes } from "../types";

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
