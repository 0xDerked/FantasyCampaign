import styled from "styled-components";
import match from "../assets/scaled/match.png";
import { scale as scaleDims } from "../utils/scale";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "../Maze/constants";
import { Image } from "../components/Image";

export const Fight = styled(Image).attrs(() => ({
  src: match,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${scaleDims(UNSCALED_VIEWPORT_HEIGHT)}px;
  width: ${scaleDims(UNSCALED_VIEWPORT_WIDTH)}px;
`;
