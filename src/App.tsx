import * as React from "react";
import styled from "styled-components";
import { ViewPort } from "./Maze/ViewPort";
import { Map } from "./Maze/Map";
import { GameDataProvider } from "./providers/GameData";
import {
  SCALE,
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "./Maze/constants";
import { useContractListeners } from "./hooks/useContractListeners";
import { useInterfaceEventsListeners } from "./hooks/useInterfaceEventsListeners";

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

const ViewPortContainer = styled.div`
  position: relative;
  height: ${UNSCALED_VIEWPORT_HEIGHT * SCALE}px;
  width: ${UNSCALED_VIEWPORT_WIDTH * SCALE}px;
`;

const Listeners = () => {
  useContractListeners();
  useInterfaceEventsListeners();
  return <div />;
};

function App() {
  return (
    <GameDataProvider>
      <Listeners />
      <GameScreenContainer>
        <ViewPortContainer>
          <ViewPort />
          <Map rotateMap={false} />
        </ViewPortContainer>
      </GameScreenContainer>
    </GameDataProvider>
  );
}

export default App;
