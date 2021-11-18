import * as React from "react";
import styled from "styled-components";
import { PositionProvider } from "./providers/Position";
import { Map } from "./Maze/Map";
import { ViewPort } from "./Maze/ViewPort";

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
        <ViewPort />
        <Map rotateMap={false} />
      </Container>
    </PositionProvider>
  );
}

export default App;
