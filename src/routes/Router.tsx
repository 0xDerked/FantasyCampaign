import * as React from "react";

import { CreateCharacterScreen } from "../Screens/CreateCharacterScreen";
import { FightScreen } from "../Screens/FightScreen";
import { SplashScreen } from "../Screens/SplashScreen";
import { MazeScreen } from "../Screens/MazeScreen";
import { LootScreen } from "../Screens/LootScreen";
import { EndScreen } from "../Screens/EndScreen";
import { GameModes } from "../types";
import { useGameData } from "../hooks/useGameData";
import { Web3Gate } from "./Web3Gate";
import { ContractsProvider } from "../providers/ContractsProvider";
import { ContractListeners } from "../hooks/useContractListeners";
import { OracleModal } from "../components/OracleModal";
import { ReactNode } from "react";

const Core = ({ children }: { children: ReactNode }) => (
  <Web3Gate>
    <ContractsProvider>
      {children}
      <OracleModal />
    </ContractsProvider>
  </Web3Gate>
);

export const Router = () => {
  const [gameData] = useGameData();
  switch (gameData.mode) {
    case GameModes.SplashScreen:
      return <SplashScreen />;
    case GameModes.SelectingCharacter:
      return (
        <Core>
          <CreateCharacterScreen />
        </Core>
      );
    case GameModes.InCombat:
      return (
        <Core>
          <FightScreen />
          <ContractListeners />
        </Core>
      );
    case GameModes.Looting:
      return (
        <Core>
          <LootScreen />
          <ContractListeners />
        </Core>
      );
    case GameModes.End:
      return (
        <Core>
          <EndScreen />
          <ContractListeners />
        </Core>
      );
    case GameModes.ExploringMaze:
    case GameModes.TurnTrigger:
    default:
      return (
        <Core>
          <MazeScreen />
          <ContractListeners />
        </Core>
      );
  }
};
