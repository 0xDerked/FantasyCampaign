import * as React from "react";
import styled from "styled-components";
import ceiling from "../assets/original/roofalt.png";
import flooralt from "../assets/original/flooralt.png";
import { UNSCALED_VIEWPORT_HEIGHT, UNSCALED_VIEWPORT_WIDTH } from "./constants";
import { scale } from "../utils/scale";
import { Image } from "../components/Image";

export const GameViewPort = styled.div`
  width: 192px;
  height: 108px;
  background-color: black;
  position: relative;
`;
export const Floor = styled(Image).attrs(() => ({
  src: flooralt,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
  height: ${scale(140)}px;
`;

export const Ceiling = styled(Image).attrs(() => ({
  src: ceiling,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
  height: ${scale(50)}px;
`;
