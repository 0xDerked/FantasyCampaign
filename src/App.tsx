import * as React from "react";
import "./App.css";
import styled from "styled-components";
import { PositionProvider } from "./providers/Position";
import { WallMap } from "./Maze/WallMap";
import { ViewPortWalls } from "./ViewPort/ViewPort2";

const Container = styled.div`
  display: flex;
  flex: 1;
  background-color: #282c34;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <PositionProvider>
      <Container>
        <ViewPortWalls />
        <WallMap rotateMap={false} />
      </Container>
    </PositionProvider>
  );
}

export default App;
