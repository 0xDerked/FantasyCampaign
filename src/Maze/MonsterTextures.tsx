import * as React from "react";
import styled, { StyledComponent } from "styled-components";

const Monster1 = styled.div.attrs(() => ({
  children: "🐉",
}))`
  position: absolute;
  top: 8px;
  left: 120px;
  width: 28px;
  z-index: 301;
  font-size: 186px;
`;

const Monster2 = styled.div.attrs(() => ({
  children: "🐉",
}))`
  position: absolute;
  top: 21px;
  left: 154px;
  width: 28px;
  z-index: 201;
  font-size: 134px;
`;

const Monster1_2 = styled.div.attrs(() => ({
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
  "0,-1": Monster1,
  "0,-2": Monster2,
  "-1,-1": Monster1_2,
};
