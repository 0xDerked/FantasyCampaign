import * as React from "react";
import { doorsCoords, spawnPointCoords, wallCoords } from "../Maze/mapData";
import { GameData, GameModes } from "../types";
import { useEffect } from "react";

export const initialGameData: GameData = {
  position: { col: 1, dir: 0, row: 1 },
  walls: wallCoords,
  doors: doorsCoords,
  spawnPoints: spawnPointCoords,
  selectedTokenId: null,
  mode: GameModes.SplashScreen,
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
