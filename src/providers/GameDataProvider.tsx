import * as React from "react";
import { GameData, GameModes } from "../types";
import { useEffect } from "react";

const initialPosition = { col: 0, dir: 0, row: 0 };

export const initialGameData: GameData = {
  selectedTokenId: null,
  mode: GameModes.SplashScreen,
  message: null,
  isRollingDice: false,
  moves: [initialPosition],
  isGateOpen: false,
  direction: initialPosition.dir,
};

export const GameDataContext = React.createContext<
  [GameData, React.Dispatch<React.SetStateAction<GameData>>]
>([initialGameData, () => {}]);

export const GameDataProvider: React.FC = ({ children }) => {
  const gameDataUseState = React.useState<GameData>(initialGameData);
  const [gameData, setGameData] = gameDataUseState;
  useEffect(() => {
    const storedGameData = localStorage.getItem("gameData");
    if (storedGameData) {
      const parsed: GameData = JSON.parse(storedGameData);
      parsed.message = null;
      setGameData(parsed);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("gameData", JSON.stringify(gameData));
  }, [gameData]);
  return (
    <GameDataContext.Provider value={gameDataUseState}>
      {children}
    </GameDataContext.Provider>
  );
};
