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
  filter: grayscale(${props => (props.disabled ? 1 : 0)})
    brightness(${props => (props.disabled ? 0.4 : 1)});
`;

export const ButtonLarge = styled(ButtonBase)`
  background-color: black;
  border: 1px solid #48865f;
  padding: 2px 6px;
  color: white;
  font-size: 6px;
`;

export const ButtonAttack = styled(ButtonBase)`
  padding: 1px 4px;
  color: white;
  font-size: 7px;
  background-color: red;
  border: 1px solid black;
  box-shadow: 0 0 0 1px white;
`;

export const ButtonSecondary = styled(ButtonBase)`
  background-color: transparent;
  border: 1px solid transparent;
  padding: 5px;
  color: white;
  font-size: 7px;
`;

export const ButtonText = styled(ButtonBase)`
  background-color: transparent;
  border: none;
  padding: 5px;
  color: white;
  font-size: 9px;
`;
