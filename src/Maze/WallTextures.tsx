import * as React from "react";
import styled, { StyledComponent } from "styled-components";
import wallLSide0alt from "../assets/scaled/wallLSide0alt.png";
import wallLSide1alt from "../assets/scaled/wallLSide1alt.png";
import wallLSide2alt from "../assets/scaled/wallLSide2alt.png";
import wallLSide3alt from "../assets/scaled/wallLSide3alt.png";
import wallSide1alt from "../assets/scaled/wallSide1alt.png";
import wallSide2alt from "../assets/scaled/wallSide2alt.png";
import wallFront1nor from "../assets/scaled/wallFront1nor.png";
import wallFront2nor from "../assets/scaled/wallFront2nor.png";
import wallFront3nor from "../assets/scaled/wallFront3nor.png";
import { scale } from "../utils/scale";

// --------------------------------------------------------------------------------
// Angled walls

const WallLSide0 = styled.img.attrs(() => ({
  src: wallLSide0alt,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: ${scale(64)}px;
  height: ${scale(272)}px;
  z-index: 400;
`;

const WallLSide1 = styled.img.attrs(() => ({
  src: wallLSide1alt,
}))`
  position: absolute;
  top: ${scale(18)}px;
  left: ${scale(64)}px;
  width: ${scale(56)}px;
  height: ${scale(220)}px;
  z-index: 300;
`;

const WallLSide2 = styled.img.attrs(() => ({
  src: wallLSide2alt,
}))`
  position: absolute;
  top: ${scale(40)}px;
  left: ${scale(120)}px;
  width: ${scale(28)}px;
  height: ${scale(142)}px;
  z-index: 200;
`;

const WallLSide3 = styled.img.attrs(() => ({
  src: wallLSide3alt,
}))`
  position: absolute;
  top: ${scale(47)}px;
  left: ${scale(148)}px;
  width: ${scale(22)}px;
  height: ${scale(102)}px;
  z-index: 100;
`;

const WallRSide0 = styled(WallLSide0)`
  right: 0;
  left: auto;
  transform: scaleX(-1);
`;

const WallRSide1 = styled(WallLSide1)`
  right: ${scale(64)}px;
  left: auto;
  transform: scaleX(-1);
`;

const WallRSide2 = styled(WallLSide2)`
  right: ${scale(120)}px;
  left: auto;
  transform: scaleX(-1);
`;

const WallRSide3 = styled(WallLSide3)`
  right: ${scale(148)}px;
  left: auto;
  transform: scaleX(-1);
`;

// --------------------------------------------------------------------------------
// Center front-facing walls

const WallFront1 = styled.img.attrs(() => ({
  src: wallFront1nor,
}))`
  position: absolute;
  top: ${scale(18)}px;
  left: ${scale(65)}px;
  width: ${scale(322)}px;
  height: ${scale(222)}px;
  z-index: 301;
`;

const WallFront2 = styled.img.attrs(() => ({
  src: wallFront2nor,
}))`
  position: absolute;
  top: ${scale(40)}px;
  left: ${scale(120)}px;
  width: ${scale(210)}px;
  height: ${scale(142)}px;
  z-index: 201;
`;

const WallFront3 = styled.img.attrs(() => ({
  src: wallFront3nor,
}))`
  position: absolute;
  top: ${scale(48)}px;
  right: ${scale(148)}px;
  width: ${scale(154)}px;
  height: ${scale(102)}px;
  z-index: 101;
`;

// --------------------------------------------------------------------------------
// Non-center front-facing walls

// Left
const WallSide1_1 = styled.img.attrs(() => ({
  src: wallSide1alt,
}))`
  position: absolute;
  left: 0;
  top: ${scale(18)}px;
  width: ${scale(64)}px;
  height: ${scale(222)}px;
  z-index: 300;
`;

const WallSide2_1 = styled.img.attrs(() => ({
  src: wallSide2alt,
}))`
  position: absolute;
  left: 0;
  top: ${scale(40)}px;
  width: ${scale(120)}px;
  height: ${scale(142)}px;
  z-index: 200;
`;

const WallSide3_1 = styled.img.attrs(() => ({
  src: wallFront3nor,
}))`
  position: absolute;
  left: 0;
  top: ${scale(48)}px;
  width: ${scale(148)}px;
  height: ${scale(102)}px;
  z-index: 100;
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
