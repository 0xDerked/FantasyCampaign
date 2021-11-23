import * as React from "react";
import styled from "styled-components";
import { ViewPort } from "./Maze/ViewPort";
import { Map } from "./Maze/Map";
import { GameDataProvider, useGameData } from "./providers/GameData";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "./Maze/constants";
import { useContractListeners } from "./hooks/useContractListeners";
import { useInterfaceEventsListeners } from "./hooks/useInterfaceEventsListeners";
import { CreateCharacter } from "./Screens/CreateCharacter";
import { WalletProvider } from "./providers/WalletProvider";
import { SplashScreen } from "./Screens/SplashScreen";
import { scale } from "./utils/scale";
import { Routes } from "./types";
import { StartCampaign } from "./Screens/StartCampaign";
import { Fight } from "./Screens/Fight";

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
    case Routes.Splash:
      return <SplashScreen />;
    case Routes.CreateCharacter:
      return <CreateCharacter />;
    case Routes.StartCampaign:
      return <StartCampaign />;
    case Routes.Fight:
      return <Fight />;
    case Routes.Maze:
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
  useContractListeners();
  useInterfaceEventsListeners();
  return <div />;
};

const ClearStorage = () => {
  const handleClearStorage = () => {
    localStorage.clear();
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
