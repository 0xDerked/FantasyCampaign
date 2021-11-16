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

export const W = "448px";
export const H = "272px";

export const Outer = styled.div`
  width: ${W};
  height: ${H};
  background-color: black;
  margin-right: 20px;
  position: relative;
`;

export const Floor = styled.img.attrs(props => ({
  src: flooralt,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${W};
  height: 140px;
`;

export const Ceiling = styled.img.attrs(props => ({
  src: ceiling,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: ${W};
  height: 50px;
`;

// --------------------------------------------------------------------------------
// Angled walls

export const WallLSide0 = styled.img.attrs(props => ({
  src: wallLSide0alt,
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: ${H};
  z-index: 400;
`;

export const WallLSide1 = styled.img.attrs(props => ({
  src: wallLSide1alt,
}))`
  position: absolute;
  top: 18px;
  left: 64px;
  width: 56px;
  height: 220px;
  z-index: 300;
`;

export const WallLSide2 = styled.img.attrs(props => ({
  src: wallLSide2alt,
}))`
  position: absolute;
  top: 40px;
  left: 120px;
  width: 28px;
  height: 142px;
  z-index: 200;
`;

export const WallLSide3 = styled.img.attrs(props => ({
  src: wallLSide3alt,
}))`
  position: absolute;
  top: 47px;
  left: 148px;
  width: 22px;
  height: 102px;
  z-index: 100;
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

export const WallFront1 = styled.img.attrs(props => ({
  src: wallFront1nor,
}))`
  position: absolute;
  top: 18px;
  left: 64px;
  width: 320px;
  height: 222px;
  z-index: 301;
`;

export const WallFront2 = styled.img.attrs(props => ({
  src: wallFront2nor,
}))`
  position: absolute;
  top: 40px;
  left: 120px;
  width: 208px;
  height: 142px;
  z-index: 201;
`;

export const WallFront3 = styled.img.attrs(props => ({
  src: wallFront3nor,
}))`
  position: absolute;
  top: 48px;
  right: 148px;
  width: 152px;
  height: 102px;
  z-index: 101;
`;

// --------------------------------------------------------------------------------
// Non-center front-facing walls

// Left
export const WallSide1_1 = styled.img.attrs(props => ({
  src: wallSide1alt,
}))`
  position: absolute;
  top: 18px;
  left: 0;
  width: 64px;
  height: 222px;
  z-index: 300;
`;

export const WallSide2_1 = styled.img.attrs(props => ({
  src: wallSide2alt,
}))`
  position: absolute;
  top: 40px;
  left: 0;
  width: 120px;
  height: 142px;
  z-index: 200;
`;

export const WallSide3_1 = styled.img.attrs(props => ({
  src: wallFront3nor,
}))`
  position: absolute;
  top: 48px;
  left: 0;
  width: 148px;
  height: 102px;
  z-index: 100;
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

export const textureMaps: Record<
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
