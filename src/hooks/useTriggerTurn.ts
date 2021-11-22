import { useEffect, useRef } from "react";
import { useGameData } from "../providers/GameData";

const contractMock = {
  async generateTurn() {
    //
  },
};

export const useTriggerTurn = () => {
  const [gameState] = useGameData();
  const { isFighting } = gameState;
  const lastFightState = useRef(isFighting);
  useEffect(() => {
    if (isFighting && !lastFightState.current) {
      (async () => {
        await contractMock.generateTurn();
      })();
    }
    lastFightState.current = isFighting;
  }, [isFighting]);
};
