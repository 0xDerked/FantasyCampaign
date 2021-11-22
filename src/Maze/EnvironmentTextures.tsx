import * as React from "react";
import styled from "styled-components";
import ceiling from "../assets/scaled/roofalt.png";
import flooralt from "../assets/scaled/flooralt.png";
import { UNSCALED_VIEWPORT_HEIGHT, UNSCALED_VIEWPORT_WIDTH } from "./constants";
import { scale } from "../utils/scale";

export const Outer = styled.div`
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
  height: ${scale(UNSCALED_VIEWPORT_HEIGHT)}px;
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
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
  height: ${scale(140)}px;
`;

export const Ceiling = styled.img.attrs(() => ({
  src: ceiling,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
  height: ${scale(50)}px;
`;
