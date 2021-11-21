import * as React from "react";
import styled, { StyledComponent } from "styled-components";
const W = "448px";
const H = "272px";
import wallLSide0alt from "../assets/scaled/wallLSide0alt.png";
import wallLSide1alt from "../assets/scaled/wallLSide1alt.png";
import wallLSide2alt from "../assets/scaled/wallLSide2alt.png";
import wallLSide3alt from "../assets/scaled/wallLSide3alt.png";
import wallSide1alt from "../assets/scaled/wallSide1alt.png";
import wallSide2alt from "../assets/scaled/wallSide2alt.png";
import wallFront1nor from "../assets/scaled/wallFront1nor.png";
import wallFront2nor from "../assets/scaled/wallFront2nor.png";
import wallFront3nor from "../assets/scaled/wallFront3nor.png";

// --------------------------------------------------------------------------------
// Angled walls

const WallLSide0 = styled.img.attrs(() => ({
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

const WallLSide1 = styled.img.attrs(() => ({
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

const WallLSide2 = styled.img.attrs(() => ({
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

const WallLSide3 = styled.img.attrs(() => ({
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

const WallRSide0 = styled(WallLSide0)`
  right: 0;
  left: auto;
  transform: scaleX(-1);
`;

const WallRSide1 = styled(WallLSide1)`
  right: 64px;
  left: auto;
  transform: scaleX(-1);
`;

const WallRSide2 = styled(WallLSide2)`
  right: 120px;
  left: auto;
  transform: scaleX(-1);
`;

const WallRSide3 = styled(WallLSide3)`
  right: 148px;
  left: auto;
  transform: scaleX(-1);
`;

// --------------------------------------------------------------------------------
// Center front-facing walls

const WallFront1 = styled.img.attrs(() => ({
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

const WallFront2 = styled.img.attrs(() => ({
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

const WallFront3 = styled.img.attrs(() => ({
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
const WallSide1_1 = styled.img.attrs(() => ({
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

const WallSide2_1 = styled.img.attrs(() => ({
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

const WallSide3_1 = styled.img.attrs(() => ({
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

const WallSide1_2 = styled(WallSide1_1)`
  right: 0;
  left: auto;
  transform: scaleX(-1);
`;

const WallSide2_2 = styled(WallSide2_1)`
  right: 0;
  left: auto;
  transform: scaleX(-1);
`;

const WallSide3_2 = styled(WallSide3_1)`
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
