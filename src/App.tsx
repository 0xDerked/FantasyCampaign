import * as React from "react";
import styled from "styled-components";
import { PositionProvider } from "./providers/Position";
import { ViewPort } from "./Maze/ViewPort";
import image from "./assets/FANTASY_CHARACTERS_3_1.png";
import { Map } from "./Maze/Map";

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
    <PositionProvider>
      <Container>
        <ViewPort />
      </Container>
      <Container2>
        <Map rotateMap={false} />
      </Container2>
      {/*<img*/}
      {/*  style={{ position: "absolute", left: 100, top: 47, zIndex: 1000 }}*/}
      {/*  src={image}*/}
      {/*/>*/}
    </PositionProvider>
  );
}

export default App;
