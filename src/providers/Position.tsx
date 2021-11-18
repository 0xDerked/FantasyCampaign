import * as React from "react";
import { useUserPosition } from "./hooks";
import { Pos } from "../utils/positionHelpers";

const PositionContext = React.createContext<Pos>({
  col: 0,
  dir: 0,
  row: 0,
});

export const PositionProvider: React.FC = ({ children }) => {
  const position = useUserPosition();
  return (
    <PositionContext.Provider value={position}>
      {children}
    </PositionContext.Provider>
  );
};

export const usePositionContext = () => {
  const context = React.useContext(PositionContext);
  if (context === undefined) {
    throw new Error(
      "usePositionContext must be used within a PositionProvider"
    );
  }
  return context;
};
