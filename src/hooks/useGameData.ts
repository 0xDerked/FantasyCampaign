import * as React from "react";
import { GameDataContext } from "../providers/GameDataProvider";

export const useGameData = () => {
  const context = React.useContext(GameDataContext);
  if (context === undefined) {
    throw new Error(
      "useGameDataContext must be used within a GameDataProvider"
    );
  }
  return context;
};
