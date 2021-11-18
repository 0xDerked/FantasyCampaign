import { useEffect, useState } from "react";
import {
  goBackwards,
  goForwards,
  Keys,
  Pos,
  rotLeft,
  rotRight,
  strafeLeft,
  strafeRight,
} from "../utils/positionHelpers";

export const useUserPosition = () => {
  const [pos, setPos] = useState<Pos>({ row: 0, col: 0, dir: 0 });

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case Keys.Forward: {
        setPos(goForwards);
        break;
      }
      case Keys.Backward: {
        setPos(goBackwards);
        break;
      }
      case Keys.StrafeLeft: {
        setPos(strafeLeft);
        break;
      }
      case Keys.StrafeRight: {
        setPos(strafeRight);
        break;
      }
      case Keys.RotLeft: {
        setPos(rotLeft);
        break;
      }
      case Keys.RotRight: {
        setPos(rotRight);
        break;
      }
      default:
        break;
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // Remove event listeners on cleanup
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return pos;
};
