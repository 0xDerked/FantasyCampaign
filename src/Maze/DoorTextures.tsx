import * as React from "react";
import styled, { StyledComponent } from "styled-components";
import doorFront1 from "../assets/doorFront1.png";
import doorFront2 from "../assets/doorFront2.png";
import doorInnerDefault from "../assets/doorinner_default.png";
import doorInnerDefault2 from "../assets/doorinner_default2.png";

const SLIDING_DOOR_NEAR_WIDTH = 225;
const SLIDING_DOOR_MEDIUM_WIDTH = 144;
const SLIDING_DOOR_MEDIUM_LEFT = -65;

const DOOR_FRAME_NEAR_WIDTH = 323;
const DOOR_FRAME_NEAR_LEFT = -259;
const DOOR_FRAME_MEDIUM_WIDTH = 209;
const DOOR_FRAME_FAR_WIDTH = 152;

// --------------------------------------------------------------------------------

// Close
const DoorFront1 = styled.img.attrs(() => ({
  src: doorFront1,
}))`
  width: ${DOOR_FRAME_NEAR_WIDTH}px;
  image-rendering: pixelated;
`;
const DoorFront1Inner = styled.img.attrs(() => ({
  src: doorInnerDefault,
}))`
  position: absolute;
  top: 9px;
  left: 49px;
  width: ${SLIDING_DOOR_NEAR_WIDTH}px;
  image-rendering: pixelated;
`;
const DoorFront1Container = styled.div.attrs(() => ({
  children: [<DoorFront1 key={1} />, <DoorFront1Inner key={2} />],
}))`
  position: absolute;
  top: 19px;
  left: 63px;
  width: ${DOOR_FRAME_NEAR_WIDTH}px;
  z-index: 302;
`;

// --------------------------------------------------------------------------------
// Ahead medium
const DoorFront2 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  width: ${DOOR_FRAME_MEDIUM_WIDTH}px;
  image-rendering: pixelated;
`;
const DoorFront2Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: 33px;
  width: ${SLIDING_DOOR_MEDIUM_WIDTH}px;
  position: absolute;
  top: 5px;
  image-rendering: pixelated;
`;
const DoorFront2Container = styled.div.attrs(() => ({
  children: [<DoorFront2 key={1} />, <DoorFront2Inner key={2} />],
}))`
  position: absolute;
  left: 119px;
  top: 39px;
  width: ${DOOR_FRAME_MEDIUM_WIDTH}px;
  z-index: 202;
  filter: brightness(0.7);
  image-rendering: pixelated;
`;
// --------------------------------------------------------------------------------
// Ahead far

const DoorFront3 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  width: ${DOOR_FRAME_FAR_WIDTH}px;
  image-rendering: pixelated;
`;
const DoorFront3Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: 23px;
  width: 106px;
  position: absolute;
  top: 2px;
  image-rendering: pixelated;
`;
const DoorFront3Container = styled.div.attrs(() => ({
  children: [<DoorFront3 key={1} />, <DoorFront3Inner key={2} />],
}))`
  position: absolute;
  left: 148px;
  top: 49px;
  width: ${DOOR_FRAME_FAR_WIDTH}px;
  z-index: 202;
  filter: brightness(0.6);
  image-rendering: pixelated;
`;

// --------------------------------------------------------------------------------
// Close left
const DoorSide1_1Container = styled(DoorFront1Container)`
  left: ${DOOR_FRAME_NEAR_LEFT}px;
`;

// --------------------------------------------------------------------------------
// Close right
const DoorSide1_2Container = styled(DoorFront1Container)`
  right: ${DOOR_FRAME_NEAR_LEFT}px;
  left: auto;
  transform: scaleX(-1);
`;

// --------------------------------------------------------------------------------
// Medium right
const DoorSide2_2Container = styled(DoorFront2Container)`
  right: ${SLIDING_DOOR_MEDIUM_LEFT}px;
  left: auto;
  transform: scaleX(-1);
`;

// --------------------------------------------------------------------------------
// Medium left

const DoorSide2_1Container = styled(DoorFront2Container)`
  left: ${SLIDING_DOOR_MEDIUM_LEFT}px;
  transform: scaleX(-1);
`;

export const doorTextureMaps: Record<
  `${number},${number},${number},${number}`,
  StyledComponent<"img" | "div", any>
> = {
  // Ahead
  "-0.5,-0.5,0.5,-0.5": DoorFront1Container, // Close
  "-0.5,-1.5,0.5,-1.5": DoorFront2Container, // Medium
  "-0.5,-2.5,0.5,-2.5": DoorFront3Container, // Far
  "-1.5,-0.5,-0.5,-0.5": DoorSide1_1Container, // Close
  "0.5,-1.5,1.5,-1.5": DoorSide2_2Container,
  "0.5,-0.5,1.5,-0.5": DoorSide1_2Container,
  "-1.5,-1.5,-0.5,-1.5": DoorSide2_1Container, // Medium
};
