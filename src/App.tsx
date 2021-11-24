import * as React from "react";
import styled from "styled-components";
import { ViewPort } from "./Maze/ViewPort";
import { Map } from "./Maze/Map";

import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "./Maze/constants";
import { useInterfaceEventsListeners } from "./hooks/useInterfaceEventsListeners";
import { CreateCharacterScreen } from "./Screens/CreateCharacter";
import { WalletProvider } from "./providers/WalletProvider";
import { SplashScreen } from "./Screens/SplashScreen";
import { scale } from "./utils/scale";
import { Routes } from "./types";
import { StartCampaignScreen } from "./Screens/StartCampaign";
import { FightScreen } from "./Screens/FightScreen";
import { useGameData } from "./hooks/useGameData";
import { GameDataProvider, initialGameData } from "./providers/GameData";

const GameScreenContainer = styled.div`
  display: flex;
  flex: 1;
  background-color: #282c34;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transform: scale(3);
  user-select: none;
`;

const ClearStorageButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  color: red;
  background-color: transparent;
  font-family: inherit;
  border: none;
  outline: none;
`;

const Router = () => {
  const [gameData] = useGameData();
  switch (gameData.route) {
    case Routes.SplashScreen:
      return <SplashScreen />;
    case Routes.CreateCharacterScreen:
      return <CreateCharacterScreen />;
    case Routes.StartCampaignScreen:
      return <StartCampaignScreen />;
    case Routes.Turn:
      return <FightScreen />;
    case Routes.MazeScreen:
    default:
      return (
        <>
          <ViewPort />
          <Map rotateMap={false} />
        </>
      );
  }
};

const ViewPortContainer = styled.div`
  position: relative;
  height: ${scale(UNSCALED_VIEWPORT_HEIGHT)}px;
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
`;

const Listeners = () => {
  // useContractListeners();
  useInterfaceEventsListeners();
  return <div />;
};

const ClearStorage = () => {
  const [, setGameData] = useGameData();
  const handleClearStorage = () => {
    localStorage.clear();
    setGameData(initialGameData);
  };
  return (
    <ClearStorageButton onClick={handleClearStorage}>
      Clear storage
    </ClearStorageButton>
  );
};

function App() {
  return (
    <GameDataProvider>
      <WalletProvider>
        <Listeners />
        <GameScreenContainer>
          <ViewPortContainer>
            <Router />
          </ViewPortContainer>
        </GameScreenContainer>
        <ClearStorage />
      </WalletProvider>
    </GameDataProvider>
  );
}

export default App;
