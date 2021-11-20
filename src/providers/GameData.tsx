import * as React from "react";
import { doorsCoords, wallCoords } from "../Maze/mapData";
import { GameData } from "../types";

const defaultValue: GameData = {
  position: { col: 1, dir: 0, row: 1 },
  walls: wallCoords,
  doors: doorsCoords,
};

const GameDataContext = React.createContext<
  [GameData, React.Dispatch<React.SetStateAction<GameData>>]
>([defaultValue, () => {}]);

export const GameDataProvider: React.FC = ({ children }) => {
  const setState = React.useState<GameData>(defaultValue);
  return (
    <GameDataContext.Provider value={setState}>
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
