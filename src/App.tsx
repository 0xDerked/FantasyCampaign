import * as React from "react";
import styled from "styled-components";
import { ViewPort } from "./Maze/ViewPort";
import { Map } from "./Maze/Map";
import { GameDataProvider } from "./providers/GameData";

const Container = styled.div`
  display: flex;
  flex: 1;
  background-color: #282c34;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Container2 = styled.div``;

function App() {
  return (
    <GameDataProvider>
      <Container>
        <ViewPort />
      </Container>
      <Container2>
        <Map rotateMap={false} />
      </Container2>
    </GameDataProvider>
  );
}

export default App;
