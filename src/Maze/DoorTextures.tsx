import * as React from "react";
import styled, { StyledComponent } from "styled-components";
import doorFront1 from "../assets/scaled/doorFront1.png";
import doorFront2 from "../assets/scaled/doorFront2.png";
import doorInnerDefault from "../assets/scaled/doorinner_default.png";
import doorInnerDefault2 from "../assets/scaled/doorinner_default2.png";
import { SCALE } from "./constants";

const DOOR_FRAME_FAR_WIDTH = 127;
const DOOR_FRAME_MEDIUM_LEFT = -38;
const DOOR_FRAME_MEDIUM_WIDTH = 175;
const DOOR_FRAME_NEAR_LEFT = -158;
const DOOR_FRAME_NEAR_WIDTH = 259;

type OpenState = {
  open: boolean;
};

// --------------------------------------------------------------------------------

// Close

const DoorFront1 = styled.img.attrs(() => ({
  src: doorFront1,
}))`
  width: ${DOOR_FRAME_NEAR_WIDTH * SCALE}px;
`;
const DoorFront1Inner = styled.img.attrs(() => ({
  src: doorInnerDefault,
}))<OpenState>`
  position: absolute;
  top: ${6 * SCALE}px;
  left: ${38 * SCALE}px;
  width: ${182 * SCALE}px;
  opacity: ${props => (props.open ? 0 : 1)};
`;
const DoorFront1Container = styled.div.attrs(({ open }: OpenState) => ({
  children: [<DoorFront1 key={1} />, <DoorFront1Inner key={2} open={open} />],
}))`
  position: absolute;
  top: ${30 * SCALE}px;
  left: ${96 * SCALE}px;
  width: ${DOOR_FRAME_NEAR_WIDTH * SCALE}px;
  z-index: 300;
`;

// --------------------------------------------------------------------------------
// Ahead medium

const DoorFront2 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  width: ${DOOR_FRAME_MEDIUM_WIDTH * SCALE}px;
`;
const DoorFront2Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))<OpenState>`
  position: absolute;
  left: ${25 * SCALE}px;
  width: ${125 * SCALE}px;
  top: ${3 * SCALE}px;
  opacity: ${props => (props.open ? 0 : 1)};
`;
const DoorFront2Container = styled.div.attrs(({ open }: OpenState) => ({
  children: [<DoorFront2 key={1} />, <DoorFront2Inner key={2} open={open} />],
}))`
  position: absolute;
  left: ${136 * SCALE}px;
  top: ${47 * SCALE}px;
  width: ${DOOR_FRAME_MEDIUM_WIDTH * SCALE}px;
  z-index: 200;
  filter: brightness(0.7);
`;

// --------------------------------------------------------------------------------
// Ahead far

const DoorFront3 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  width: ${SCALE * DOOR_FRAME_FAR_WIDTH}px;
`;
const DoorFront3Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))<OpenState>`
  position: absolute;
  left: ${19 * SCALE}px;
  width: ${89 * SCALE}px;
  top: ${2 * SCALE}px;
  opacity: ${props => (props.open ? 0 : 1)};
`;
const DoorFront3Container = styled.div.attrs(({ open }: OpenState) => ({
  children: [<DoorFront3 key={1} />, <DoorFront3Inner key={2} open={open} />],
}))`
  position: absolute;
  left: ${160 * SCALE}px;
  top: ${52 * SCALE}px;
  width: ${DOOR_FRAME_FAR_WIDTH * SCALE}px;
  z-index: 200;
  filter: brightness(0.3);
`;

// --------------------------------------------------------------------------------
// Close left

const DoorSide1_1Container = styled(DoorFront1Container)`
  left: ${DOOR_FRAME_NEAR_LEFT * SCALE}px;
  z-index: 199;
`;

// --------------------------------------------------------------------------------
// Close right

const DoorSide1_2Container = styled(DoorFront1Container)`
  z-index: 299;
  right: ${DOOR_FRAME_NEAR_LEFT * SCALE}px;
  left: auto;
  transform: scaleX(-1);
`;

// --------------------------------------------------------------------------------
// Medium right

const DoorSide2_2Container = styled(DoorFront2Container)`
  z-index: 199;
  right: ${DOOR_FRAME_MEDIUM_LEFT * SCALE}px;
  left: auto;
  transform: scaleX(-1);
`;

// --------------------------------------------------------------------------------
// Medium left

const DoorSide2_1Container = styled(DoorFront2Container)`
  z-index: 199;
  left: ${DOOR_FRAME_MEDIUM_LEFT * SCALE}px;
  transform: scaleX(-1);
`;

export const doorTextureMaps: Record<
  `${number},${number},${number},${number}`,
  StyledComponent<"img" | "div", any>
> = {
  "-0.5,-1,0.5,-1": DoorFront1Container, // Ahead close
  "-0.5,-2,0.5,-2": DoorFront2Container, // Ahead medium
  "-0.5,-3,0.5,-3": DoorFront3Container, // Ahead far
  "-1.5,-1,-0.5,-1": DoorSide1_1Container, // Left close
  "0.5,-1,1.5,-1": DoorSide1_2Container, // Right close
  "-1.5,-2,-0.5,-2": DoorSide2_1Container, // Left medium
  "0.5,-2,1.5,-2": DoorSide2_2Container, // Medium
};