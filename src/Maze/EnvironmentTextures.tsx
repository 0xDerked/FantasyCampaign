import * as React from "react";
import styled from "styled-components";
import ceiling from "../assets/scaled/roofalt.png";
import flooralt from "../assets/scaled/flooralt.png";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  SCALE,
  UNSCALED_VIEWPORT_WIDTH,
} from "./constants";

export const Outer = styled.div`
  width: ${UNSCALED_VIEWPORT_WIDTH * SCALE}px;
  height: ${UNSCALED_VIEWPORT_HEIGHT * SCALE}px;
  background-color: black;
  position: relative;
  overflow: hidden;
`;
export const Floor = styled.img.attrs(() => ({
  src: flooralt,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${UNSCALED_VIEWPORT_WIDTH * SCALE}px;
  height: ${140 * SCALE}px;
`;

export const Ceiling = styled.img.attrs(() => ({
  src: ceiling,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: ${UNSCALED_VIEWPORT_WIDTH * SCALE}px;
  height: ${50 * SCALE}px;
`;
