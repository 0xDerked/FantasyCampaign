import * as React from "react";
import styled from "styled-components";
import match from "../assets/scaled/match.png";
import { scale as scaleDims } from "../utils/scale";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "../Maze/constants";
import { Image } from "../components/Image";
import { useGetSelectedCharacter } from "../hooks/useGetSelectedCharacter";
import { useGameData } from "../hooks/useGameData";

const FightScreenMock = styled(Image).attrs(() => ({
  src: match,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${scaleDims(UNSCALED_VIEWPORT_HEIGHT)}px;
  width: ${scaleDims(UNSCALED_VIEWPORT_WIDTH)}px;
`;

export const FightScreen = () => {
  const character = useGetSelectedCharacter();
  const [gameData] = useGameData();
  return <FightScreenMock />;
};
