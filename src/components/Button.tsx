import styled from "styled-components";
import { scale } from "../utils/scale";

const ButtonBase = styled.button`
  appearance: none;
  font-family: inherit;
  border-radius: 0;
  outline: none;
  text-align: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.disabled ? 0.2 : 1)};
`;

export const ButtonLarge = styled(ButtonBase)`
  background-color: black;
  border: ${scale(3)}px solid blue;
  padding: ${scale(10)}px;
  color: white;
  font-size: ${scale(30)}px;
`;

export const ButtonAttack = styled(ButtonBase)`
  background-color: red;
  border: ${scale(3)}px double white;
  padding: ${scale(6)}px;
  color: white;
  font-size: ${scale(20)}px;
`;
