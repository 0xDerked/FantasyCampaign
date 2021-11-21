import * as React from "react";
import styled from "styled-components";

const W = "448px";
const H = "272px";
import ceiling from "../assets/scaled/roofalt.png";
import flooralt from "../assets/scaled/flooralt.png";

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
