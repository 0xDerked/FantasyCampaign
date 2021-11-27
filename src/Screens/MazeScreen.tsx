import * as React from "react";
import { doorTextureMaps } from "../Maze/DoorTextures";
import { wallTextureMaps } from "../Maze/WallTextures";
import { Ceiling, Floor, GameViewPort } from "../Maze/EnvironmentTextures";
import { DoorCoords, WallType } from "../types";
import { useWallsWithTransforms } from "../hooks/useWallsWithTransforms";
import { useDoorsWithTransforms } from "../hooks/useDoorsWithTransforms";
import clone from "lodash/clone";
import { useCallback } from "react";
import { useGameData } from "../hooks/useGameData";
import { useTriggerTurn } from "../hooks/useTriggerTurn";
import { useQueryAllMintedCharacters } from "../api/useQueryAllMintedCharacters";
import { Map } from "../Maze/Map";
import { calculateProof } from "../utils/calculateProof";
import styled from "styled-components";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "../Maze/constants";
import { scale } from "../utils/scale";

const CentreCrop = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;

const NaturalView = styled.div`
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
  height: ${scale(UNSCALED_VIEWPORT_HEIGHT)}px;
  position: relative;
`;

export const MazeScreen = () => {
  useTriggerTurn();
  const walls = useWallsWithTransforms();
  const doors = useDoorsWithTransforms();
  useQueryAllMintedCharacters();
  useFinalPositionCheck();
  const [gameData, setGameData] = useGameData();

  const wallSurfaces = walls
    .map(values => {
      const { x1, y1, x2, y2, type } = values;
      let textureMap;
      switch (type) {
        case WallType.Wall1:
          textureMap = wallTextureMaps;
          break;
        case WallType.Wall2:
          textureMap = wallTextureMaps;
          break;
      }
      const leftRight = textureMap[`${x1},${y1},${x2},${y2}`];
      const rightLeft = textureMap[`${x2},${y2},${x1},${y1}`];
      return leftRight || rightLeft;
    })
    .filter(Boolean);

  const doorSurfaces = doors
    .map(values => {
      const { x1, y1, x2, y2 } = values;
      const leftRight = doorTextureMaps[`${x1},${y1},${x2},${y2}`];
      const rightLeft = doorTextureMaps[`${x2},${y2},${x1},${y1}`];
      return { Surface: leftRight || rightLeft, ...values };
    })
    .filter(Boolean);

  return (
    <GameViewPort>
      <CentreCrop>
        <NaturalView>
          <Ceiling />
          <Floor />
          {wallSurfaces.map((Surface, index) => {
            return Surface ? <Surface key={index} /> : null;
          })}
          {doorSurfaces.map(({ Surface, ...rest }, index) => {
            return Surface ? (
              <Surface
                key={index}
                // @ts-ignore
                open={rest.open}
              />
            ) : null;
          })}
        </NaturalView>
        <Map rotateMap={false} />
      </CentreCrop>
    </GameViewPort>
  );
};
