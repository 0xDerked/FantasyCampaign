import * as React from "react";
import styled from "styled-components";
import { scale } from "../utils/scale";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "../Maze/constants";

const Container = styled.div`
  position: absolute;
  left: ${scale(UNSCALED_VIEWPORT_WIDTH / 10)}px;
  right: ${scale(UNSCALED_VIEWPORT_WIDTH / 10)}px;
  top: ${scale(UNSCALED_VIEWPORT_HEIGHT / 10)}px;
  bottom: ${scale(UNSCALED_VIEWPORT_HEIGHT / 10)}px;
  background-color: black;
  color: white;
  font-size: ${scale(25)}px;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${scale(10)}px;
  border: 3px double white;
`;

export const Modal = () => {
  return (
    <Container>
      <span>Something mysterious is happening!</span>
      <span>You are frozen in terror!</span>
    </Container>
  );
};
