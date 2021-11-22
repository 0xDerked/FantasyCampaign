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
import { CreateCharacter } from "./CreateCharacter";
import { useWallet, WalletProvider } from "./providers/WalletProvider";
import { SplashScreen } from "./SplashScreen";
import { scale } from "./utils/scale";

const GameScreenContainer = styled.div`
  display: flex;
  flex: 1;
  background-color: #282c34;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transform: scale(3);
`;

const GameScreen = () => {
  const [gameData] = useGameData();
  const { signer } = useWallet();
  if (!signer) {
    return <SplashScreen />;
  }
  if (gameData.characterClass === null) {
    return <CreateCharacter />;
  }
  return (
    <ViewPortContainer>
      <ViewPort />
      <Map rotateMap={false} />
    </ViewPortContainer>
  );
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

function App() {
  return (
    <GameDataProvider>
      <WalletProvider>
        <Listeners />
        <GameScreenContainer>
          <GameScreen />
        </GameScreenContainer>
      </WalletProvider>
    </GameDataProvider>
  );
}

export default App;
