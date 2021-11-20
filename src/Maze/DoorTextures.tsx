import * as React from "react";
import styled, { StyledComponent } from "styled-components";
import doorFront1 from "../assets/doorFront1.png";
import doorFront2 from "../assets/doorFront2.png";
import doorInnerDefault from "../assets/doorinner_default.png";
import doorInnerDefault2 from "../assets/doorinner_default2.png";

const W = "448px";
const H = "272px";

const SLIDING_DOOR_NEAR_WIDTH = 229;
const SLIDING_DOOR_MEDIUM_WIDTH = 154;
const SLIDING_DOOR_FAR_WIDTH = 110;
const SLIDING_DOOR_NEAR_TOP = 25;
const SLIDING_DOOR_MEDIUM_TOP = 42;
const SLIDING_DOOR_FAR_TOP = 49;
const SLIDING_DOOR_NEAR_BRIGHTNESS = 1;
const SLIDING_DOOR_MEDIUM_BRIGHTNESS = 0.7;
const SLIDING_DOOR_FAR_BRIGHTNESS = 0.6;
const SLIDING_DOOR_NEAR_LEFT = -210;
const SLIDING_DOOR_MEDIUM_LEFT = -65;
const SLIDING_DOOR_FAR_LEFT = 169;

const DOOR_FRAME_NEAR_WIDTH = 323;
const DOOR_FRAME_NEAR_TOP = 19;
const DOOR_FRAME_NEAR_LEFT_LEFT = -259;
const DOOR_FRAME_MEDIUM_WIDTH = 209;
const DOOR_FRAME_MEDIUM_TOP = 39;
const DOOR_FRAME_MEDIUM_LEFT_LEFT = -89;
const DOOR_FRAME_FAR_WIDTH = 152;
const DOOR_FRAME_FAR_TOP = 49;
// const DOOR_FRAME_FAR_LEFT_LEFT = -89;

// --------------------------------------------------------------------------------
// Door frames

// Close
const DoorFront1 = styled.img.attrs(() => ({
  src: doorFront1,
}))`
  position: absolute;
  top: ${DOOR_FRAME_NEAR_TOP}px;
  left: 63px;
  width: ${DOOR_FRAME_NEAR_WIDTH}px;
  z-index: 302;
  image-rendering: pixelated;
`;

// Ahead medium
const DoorFront2 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  position: absolute;
  left: 119px;
  top: ${DOOR_FRAME_MEDIUM_TOP}px;
  width: ${DOOR_FRAME_MEDIUM_WIDTH}px;
  z-index: 202;
  filter: brightness(0.7);
  image-rendering: pixelated;
`;

const DoorFront3 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  position: absolute;
  left: 148px;
  top: ${DOOR_FRAME_FAR_TOP}px;
  width: ${DOOR_FRAME_FAR_WIDTH}px;
  z-index: 202;
  filter: brightness(0.6);
  image-rendering: pixelated;
`;

// Close left
const DoorSide1_1 = styled.img.attrs(() => ({
  src: doorFront1,
}))`
  position: absolute;
  top: ${DOOR_FRAME_NEAR_TOP}px;
  left: ${DOOR_FRAME_NEAR_LEFT_LEFT}px;
  z-index: 302;
  width: ${DOOR_FRAME_NEAR_WIDTH}px;
  image-rendering: pixelated;
`;

// Close right
const DoorSide1_2 = styled(DoorSide1_1)`
  right: ${DOOR_FRAME_NEAR_LEFT_LEFT}px;
  left: auto;
  transform: scaleX(-1);
`;

// Distant left
const DoorSide2_1 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  position: absolute;
  left: ${DOOR_FRAME_MEDIUM_LEFT_LEFT}px;
  top: ${DOOR_FRAME_MEDIUM_TOP}px;
  width: ${DOOR_FRAME_MEDIUM_WIDTH}px;
  z-index: 202;
  filter: brightness(0.7);
  image-rendering: pixelated;
`;

const DoorSide2_2 = styled(DoorSide2_1)`
  right: ${DOOR_FRAME_MEDIUM_LEFT_LEFT}px;
  left: auto;
  transform: scaleX(-1);
  z-index: 202;
`;

export const doorTextureMaps: Record<
  `${number},${number},${number},${number}`,
  StyledComponent<"img", any>
> = {
  // Ahead
  "-0.5,-0.5,0.5,-0.5": DoorFront1, // Close
  "-0.5,-1.5,0.5,-1.5": DoorFront2, // Medium
  "-0.5,-2.5,0.5,-2.5": DoorFront3, // Far
  // Ahead left
  "-1.5,-0.5,-0.5,-0.5": DoorSide1_1, // Close
  "-1.5,-1.5,-0.5,-1.5": DoorSide2_1, // Medium
  // "-1.5,-2.5,-0.5,-2.5": WallSide3_1,
  // Ahead right
  "0.5,-0.5,1.5,-0.5": DoorSide1_2,
  "0.5,-1.5,1.5,-1.5": DoorSide2_2,
  // "0.5,-2.5,1.5,-2.5": WallSide3_2,
};

// --------------------------------------------------------------------------------
// Door inners

const DoorFront1Inner = styled.img.attrs(() => ({
  src: doorInnerDefault,
}))`
  position: absolute;
  top: ${SLIDING_DOOR_NEAR_TOP}px;
  left: 111px;
  width: ${SLIDING_DOOR_NEAR_WIDTH}px;
  z-index: 303;
  image-rendering: pixelated;
`;

// Sliding bit - ahead far
const DoorFront2Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: 147px;
  width: ${SLIDING_DOOR_MEDIUM_WIDTH}px;
  position: absolute;
  top: ${SLIDING_DOOR_MEDIUM_TOP}px;
  z-index: 203;
  filter: brightness(${SLIDING_DOOR_MEDIUM_BRIGHTNESS});
  image-rendering: pixelated;
`;

const DoorFront3Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: ${SLIDING_DOOR_FAR_LEFT}px;
  width: ${SLIDING_DOOR_FAR_WIDTH}px;
  position: absolute;
  top: ${SLIDING_DOOR_FAR_TOP}px;
  z-index: 203;
  filter: brightness(${SLIDING_DOOR_FAR_BRIGHTNESS});
  image-rendering: pixelated;
`;

// Distant left sliding bit
const DoorSide1_1Inner = styled.img.attrs(() => ({
  src: doorInnerDefault,
}))`
  position: absolute;
  top: ${SLIDING_DOOR_NEAR_TOP}px;
  left: ${SLIDING_DOOR_NEAR_LEFT}px;
  z-index: 303;
  width: ${SLIDING_DOOR_NEAR_WIDTH}px;
  image-rendering: pixelated;
`;

const DoorSide2_1Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: ${SLIDING_DOOR_MEDIUM_LEFT}px;
  width: ${SLIDING_DOOR_MEDIUM_WIDTH}px;
  position: absolute;
  top: ${SLIDING_DOOR_MEDIUM_TOP}px;
  z-index: 203;
  filter: brightness(${SLIDING_DOOR_MEDIUM_BRIGHTNESS});
  image-rendering: pixelated;
`;

const DoorSide1_2Inner = styled(DoorSide1_1Inner)`
  right: ${SLIDING_DOOR_NEAR_LEFT}px;
  left: auto;
  transform: scaleX(-1);
\`;
`;

const DoorSide2_2Inner = styled(DoorSide2_1Inner)`
  right: ${SLIDING_DOOR_MEDIUM_LEFT}px;
  left: auto;
  transform: scaleX(-1);
`;

export const doorInnerTextureMaps: Record<
  `${number},${number},${number},${number}`,
  StyledComponent<"img", any>
> = {
  // Ahead
  "-0.5,-0.5,0.5,-0.5": DoorFront1Inner, // Close
  "-0.5,-1.5,0.5,-1.5": DoorFront2Inner, // Medium
  "-0.5,-2.5,0.5,-2.5": DoorFront3Inner, // Far
  // Ahead left
  "-1.5,-0.5,-0.5,-0.5": DoorSide1_1Inner, // Close
  "-1.5,-1.5,-0.5,-1.5": DoorSide2_1Inner, // Medium
  // "-1.5,-2.5,-0.5,-2.5": WallSide3_1,
  // Ahead right
  "0.5,-0.5,1.5,-0.5": DoorSide1_2Inner,
  "0.5,-1.5,1.5,-1.5": DoorSide2_2Inner,
  // "0.5,-2.5,1.5,-2.5": WallSide3_2,
};
