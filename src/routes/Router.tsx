import * as React from "react";

import { CreateCharacterScreen } from "../Screens/CreateCharacterScreen";
import { FightScreen } from "../Screens/FightScreen";
import { SplashScreen } from "../Screens/SplashScreen";
import { MazeScreen } from "../Screens/MazeScreen";
import { GameModes } from "../types";
import { useGameData } from "../hooks/useGameData";
import { Web3Gate } from "./Web3Gate";
import { ContractsProvider } from "../providers/ContractsProvider";

export const Router = () => {
  const [gameData] = useGameData();
  switch (gameData.mode) {
    case GameModes.SplashScreen:
      return <SplashScreen />;
    case GameModes.CreateCharacterScreen:
      return (
        <Web3Gate>
          <ContractsProvider>
            <CreateCharacterScreen />
          </ContractsProvider>
        </Web3Gate>
      );
    case GameModes.FightScreen:
      return (
        <Web3Gate>
          <ContractsProvider>
            <FightScreen />
          </ContractsProvider>
        </Web3Gate>
      );
    case GameModes.MazeScreen:
    case GameModes.TurnTrigger:
    default:
      return (
        <Web3Gate>
          <ContractsProvider>
            <MazeScreen />
          </ContractsProvider>
        </Web3Gate>
      );
  }
};