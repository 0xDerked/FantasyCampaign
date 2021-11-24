import * as React from "react";

import { CreateCharacterScreen } from "../Screens/CreateCharacterScreen";
import { FightScreen } from "../Screens/FightScreen";
import { SplashScreen } from "../Screens/SplashScreen";
import { EnterCampaignScreen } from "../Screens/EnterCampaignScreen";
import { MazeScreen } from "../Screens/MazeScreen";
import { Routes } from "../types";
import { useGameData } from "../hooks/useGameData";
import { Map } from "../Maze/Map";
import { Web3Gate } from "./Web3Gate";

export const Router = () => {
  const [gameData] = useGameData();
  switch (gameData.route) {
    case Routes.SplashScreen:
      return <SplashScreen />;
    case Routes.CreateCharacterScreen:
      return (
        <Web3Gate>
          <CreateCharacterScreen />
        </Web3Gate>
      );
    case Routes.EnterCampaignScreen:
      return (
        <Web3Gate>
          <EnterCampaignScreen />
        </Web3Gate>
      );
    case Routes.Turn:
      return (
        <Web3Gate>
          <FightScreen />
        </Web3Gate>
      );
    case Routes.MazeScreen:
    default:
      return (
        <Web3Gate>
          <MazeScreen />
          <Map rotateMap={false} />
        </Web3Gate>
      );
  }
};
