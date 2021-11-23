import * as React from "react";
import { doorsCoords, spawnPointCoords, wallCoords } from "../Maze/mapData";
import { GameData, Routes } from "../types";
import { useEffect } from "react";

const defaultValue: GameData = {
  position: { col: 1, dir: 0, row: 1 },
  walls: wallCoords,
  doors: doorsCoords,
  spawnPoints: spawnPointCoords,
  isFighting: false,
  selectedCharacterId: null,
  route: Routes.Splash,
};

const GameDataContext = React.createContext<
  [GameData, React.Dispatch<React.SetStateAction<GameData>>]
>([defaultValue, () => {}]);

export const GameDataProvider: React.FC = ({ children }) => {
  const gameDataUseState = React.useState<GameData>(defaultValue);
  const [gameData, setGameData] = gameDataUseState;
  useEffect(() => {
    const storedGameData = localStorage.getItem("gameData");
    if (storedGameData) {
      const parsed: GameData = JSON.parse(storedGameData);
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

export const useGameData = () => {
  const context = React.useContext(GameDataContext);
  if (context === undefined) {
    throw new Error(
      "useGameDataContext must be used within a GameDataProvider"
    );
  }
  return context;
};
