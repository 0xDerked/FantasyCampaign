import * as React from "react";

import { CreateCharacterScreen } from "../Screens/CreateCharacterScreen";
import { FightScreen } from "../Screens/FightScreen";
import { SplashScreen } from "../Screens/SplashScreen";
import { MazeScreen } from "../Screens/MazeScreen";
import { GameModes } from "../types";
import { useGameData } from "../hooks/useGameData";
import { Web3Gate } from "./Web3Gate";
import { ContractsProvider } from "../providers/ContractsProvider";
import { ContractListeners } from "../hooks/useContractListeners";

export const Router = () => {
  const [gameData] = useGameData();
  switch (gameData.mode) {
    case GameModes.SplashScreen:
      return <SplashScreen />;
    case GameModes.SelectingCharacter:
      return (
        <Web3Gate>
          <ContractsProvider>
            <ContractListeners />
            <CreateCharacterScreen />
          </ContractsProvider>
        </Web3Gate>
      );
    case GameModes.InCombat:
      return (
        <Web3Gate>
          <ContractsProvider>
            <ContractListeners />
            <FightScreen />
          </ContractsProvider>
        </Web3Gate>
      );
    case GameModes.ExploringMaze:
    case GameModes.TurnTrigger:
    default:
      return (
        <Web3Gate>
          <ContractsProvider>
            <ContractListeners />
            <MazeScreen />
          </ContractsProvider>
        </Web3Gate>
      );
  }
};
