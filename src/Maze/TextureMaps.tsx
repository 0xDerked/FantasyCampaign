import * as React from "react";
import styled, { StyledComponent } from "styled-components";
import ceiling from "../assets/roofalt.png";
import flooralt from "../assets/flooralt.png";
import wallLSide0alt from "../assets/wallLSide0alt.png";
import wallLSide1alt from "../assets/wallLSide1alt.png";
import wallLSide2alt from "../assets/wallLSide2alt.png";
import wallLSide3alt from "../assets/wallLSide3alt.png";
import wallSide1alt from "../assets/wallSide1alt.png";
import wallSide2alt from "../assets/wallSide2alt.png";
import wallFront1nor from "../assets/wallFront1nor.png";
import wallFront2nor from "../assets/wallFront2nor.png";
import wallFront3nor from "../assets/wallFront3nor.png";
import doorFront1 from "../assets/doorFront1.png";
import doorFront2 from "../assets/doorFront2.png";
import doorInnerDefault from "../assets/doorinner_default.png";
import doorInnerDefault2 from "../assets/doorinner_default2.png";
import doorSide1 from "../assets/doorSide1.png";

export const W = "448px";
export const H = "272px";

const SLIDING_DOOR_NEAR_WIDTH = 229;
const SLIDING_DOOR_MEDIUM_WIDTH = 156;
const SLIDING_DOOR_FAR_WIDTH = "32px";
const SLIDING_DOOR_NEAR_TOP = 25;
const SLIDING_DOOR_MEDIUM_TOP = 47;
const SLIDING_DOOR_FAR_TOP = "32px";
const SLIDING_DOOR_NEAR_BRIGHTNESS = 1;
const SLIDING_DOOR_MEDIUM_BRIGHTNESS = 0.7;
const SLIDING_DOOR_FAR_BRIGHTNESS = 0.6;
const SLIDING_DOOR_NEAR_LEFT = -210;
const SLIDING_DOOR_MEDIUM_LEFT = 47;
const SLIDING_DOOR_FAR_LEFT = "32px";

export const Outer = styled.div`
  width: ${W};
  height: ${H};
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
  width: ${W};
  height: 140px;
  image-rendering: pixelated;
`;

export const Ceiling = styled.img.attrs(() => ({
  src: ceiling,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: ${W};
  height: 50px;
  image-rendering: pixelated;
`;

// --------------------------------------------------------------------------------
// Angled walls

export const WallLSide0 = styled.img.attrs(() => ({
  src: wallLSide0alt,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: ${H};
  z-index: 400;
  image-rendering: pixelated;
`;

export const WallLSide1 = styled.img.attrs(() => ({
  src: wallLSide1alt,
}))`
  position: absolute;
  top: 18px;
  left: 64px;
  width: 56px;
  height: 220px;
  z-index: 300;
  image-rendering: pixelated;
`;

export const WallLSide2 = styled.img.attrs(() => ({
  src: wallLSide2alt,
}))`
  position: absolute;
  top: 40px;
  left: 120px;
  width: 28px;
  height: 142px;
  z-index: 200;
  image-rendering: pixelated;
`;

export const WallLSide3 = styled.img.attrs(() => ({
  src: wallLSide3alt,
}))`
  position: absolute;
  top: 47px;
  left: 148px;
  width: 22px;
  height: 102px;
  z-index: 100;
  image-rendering: pixelated;
`;

export const WallRSide0 = styled(WallLSide0)`
  right: 0;
  left: auto;
  transform: scaleX(-1);
`;

export const WallRSide1 = styled(WallLSide1)`
  right: 64px;
  left: auto;
  transform: scaleX(-1);
`;

export const WallRSide2 = styled(WallLSide2)`
  right: 120px;
  left: auto;
  transform: scaleX(-1);
`;

export const WallRSide3 = styled(WallLSide3)`
  right: 148px;
  left: auto;
  transform: scaleX(-1);
`;

// --------------------------------------------------------------------------------
// Center front-facing walls

export const WallFront1 = styled.img.attrs(() => ({
  src: wallFront1nor,
}))`
  position: absolute;
  top: 18px;
  left: 64px;
  width: 320px;
  height: 222px;
  z-index: 301;
  image-rendering: pixelated;
`;

export const WallFront2 = styled.img.attrs(() => ({
  src: wallFront2nor,
}))`
  position: absolute;
  top: 40px;
  left: 120px;
  width: 208px;
  height: 142px;
  z-index: 201;
  image-rendering: pixelated;
`;

export const WallFront3 = styled.img.attrs(() => ({
  src: wallFront3nor,
}))`
  position: absolute;
  top: 48px;
  right: 148px;
  width: 152px;
  height: 102px;
  z-index: 101;
  image-rendering: pixelated;
`;

// --------------------------------------------------------------------------------
// Non-center front-facing walls

// Left
export const WallSide1_1 = styled.img.attrs(() => ({
  src: wallSide1alt,
}))`
  position: absolute;
  top: 18px;
  left: 0;
  width: 64px;
  height: 222px;
  z-index: 300;
  image-rendering: pixelated;
`;

export const WallSide2_1 = styled.img.attrs(() => ({
  src: wallSide2alt,
}))`
  position: absolute;
  top: 40px;
  left: 0;
  width: 120px;
  height: 142px;
  z-index: 200;
  image-rendering: pixelated;
`;

export const WallSide3_1 = styled.img.attrs(() => ({
  src: wallFront3nor,
}))`
  position: absolute;
  top: 48px;
  left: 0;
  width: 148px;
  height: 102px;
  z-index: 100;
  image-rendering: pixelated;
`;

// Right

export const WallSide1_2 = styled(WallSide1_1)`
  right: 0;
  left: auto;
  transform: scaleX(-1);
`;

export const WallSide2_2 = styled(WallSide2_1)`
  right: 0;
  left: auto;
  transform: scaleX(-1);
`;

export const WallSide3_2 = styled(WallSide3_1)`
  right: 0;
  left: auto;
  transform: scaleX(-1);
`;

export const wallTextureMaps: Record<
  `${number},${number},${number},${number}`,
  StyledComponent<"img", any>
> = {
  // Ahead
  "-0.5,-0.5,0.5,-0.5": WallFront1,
  "-0.5,-1.5,0.5,-1.5": WallFront2,
  "-0.5,-2.5,0.5,-2.5": WallFront3,
  // Left
  "-0.5,-0.5,-0.5,0.5": WallLSide0,
  "-0.5,-1.5,-0.5,-0.5": WallLSide1,
  "-0.5,-2.5,-0.5,-1.5": WallLSide2,
  "-0.5,-3.5,-0.5,-2.5": WallLSide3,
  // Right
  "0.5,-0.5,0.5,0.5": WallRSide0,
  "0.5,-1.5,0.5,-0.5": WallRSide1,
  "0.5,-2.5,0.5,-1.5": WallRSide2,
  "0.5,-3.5,0.5,-2.5": WallRSide3,
  // Ahead left
  "-1.5,-0.5,-0.5,-0.5": WallSide1_1,
  "-1.5,-1.5,-0.5,-1.5": WallSide2_1,
  "-1.5,-2.5,-0.5,-2.5": WallSide3_1,
  // Ahead right
  "0.5,-0.5,1.5,-0.5": WallSide1_2,
  "0.5,-1.5,1.5,-1.5": WallSide2_2,
  "0.5,-2.5,1.5,-2.5": WallSide3_2,
};

// --------------------------------------------------------------------------------
// Door frames

// Close
export const DoorFront1 = styled.img.attrs(() => ({
  src: doorFront1,
}))`
  position: absolute;
  top: 18px;
  left: 58px;
  width: 332px;
  z-index: 302;
  image-rendering: pixelated;
`;

// Ahead medium
export const DoorFront2 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  position: absolute;
  left: 114px;
  top: 38px;
  width: 220px;
  z-index: 202;
  filter: brightness(0.7);
  image-rendering: pixelated;
`;

export const DoorFront3 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  position: absolute;
  left: 145px;
  top: 46px;
  width: 158px;
  z-index: 202;
  filter: brightness(0.6);
  image-rendering: pixelated;
`;

// Close left
export const DoorSide1_1 = styled.img.attrs(() => ({
  src: doorFront1,
}))`
  position: absolute;
  top: 18px;
  left: -264px;
  z-index: 302;
  width: 332px;
  image-rendering: pixelated;
`;

// Close right
export const DoorSide1_2 = styled(DoorSide1_1)`
  right: -261px;
  left: auto;
  transform: scaleX(-1);
`;

// Distant left
export const DoorSide2_1 = styled.img.attrs(() => ({
  src: doorFront2,
}))`
  position: absolute;
  left: -96px;
  top: 38px;
  width: 220px;
  z-index: 202;
  filter: brightness(0.7);
  image-rendering: pixelated;
`;

export const DoorSide2_2 = styled(DoorSide2_1)`
  right: -96px;
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

// Sliding bit - ahead close
export const DoorInnerDefault2 = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: 25px;
  width: 125px;
  position: absolute;
  image-rendering: pixelated;
`;

export const DoorFront1Inner = styled.img.attrs(() => ({
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
export const DoorFront2Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: 146px;
  width: 156px;
  position: absolute;
  top: 42px;
  z-index: 203;
  filter: brightness(${SLIDING_DOOR_MEDIUM_BRIGHTNESS});
  image-rendering: pixelated;
`;

export const DoorFront3Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: 169px;
  width: 110px;
  position: absolute;
  top: 49px;
  z-index: 203;
  filter: brightness(${SLIDING_DOOR_FAR_BRIGHTNESS});
  image-rendering: pixelated;
`;

// Distant left sliding bit
export const DoorSide1_1Inner = styled.img.attrs(() => ({
  src: doorInnerDefault,
}))`
  position: absolute;
  top: ${SLIDING_DOOR_NEAR_TOP}px;
  left: ${SLIDING_DOOR_NEAR_LEFT}px;
  z-index: 303;
  width: ${SLIDING_DOOR_NEAR_WIDTH}px;
  image-rendering: pixelated;
`;

export const DoorSide2_1Inner = styled.img.attrs(() => ({
  src: doorInnerDefault2,
}))`
  left: -65px;
  width: 156px;
  position: absolute;
  top: 42px;
  z-index: 203;
  filter: brightness(${SLIDING_DOOR_MEDIUM_BRIGHTNESS});
  image-rendering: pixelated;
`;

export const DoorSide1_2Inner = styled(DoorSide1_1Inner)`
  right: ${SLIDING_DOOR_NEAR_LEFT}px;
  left: auto;
  transform: scaleX(-1);
\`;
`;

export const DoorSide2_2Inner = styled(DoorSide1_2Inner)`
  right: -55px;
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

// --------------------------------------------------------------------------------
// Avatars

export const Monster1 = styled.div.attrs(() => ({
  children: "🐉",
}))`
  position: absolute;
  top: 8px;
  left: 120px;
  width: 28px;
  z-index: 301;
  font-size: 186px;
`;

export const Monster2 = styled.div.attrs(() => ({
  children: "🐉",
}))`
  position: absolute;
  top: 21px;
  left: 154px;
  width: 28px;
  z-index: 201;
  font-size: 134px;
`;

export const Monster1_2 = styled.div.attrs(() => ({
  children: "🐉",
}))`
  position: absolute;
  top: 21px;
  left: 14px;
  width: 28px;
  z-index: 201;
  font-size: 134px;
`;

export const monsterMaps: Record<
  `${number},${number}`,
  StyledComponent<"div", any>
> = {
  // Ahead
  // "0,-1": Monster1,
  // "0,-2": Monster2,
  // "-1,-1": Monster1_2,
};
