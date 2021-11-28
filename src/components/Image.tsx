import styled from "styled-components";

export const Image = styled.img.attrs(() => ({
  draggable: false,
}))`
  image-rendering: pixelated;
`;
