import { useGameData } from "./useGameData";
import { useEffect } from "react";
import { calculateProof } from "../utils/calculateProof";
import clone from "lodash/clone";
import { moveIsFinal } from "../api/api";
import { useContracts } from "./useContracts";
import { useQuerySigner } from "../api/useQuerySigner";

const X_FINAL = 5;
const Y_FINAL = 5;

export const useFinalPositionCheck = () => {
  const [gameData, setGameData] = useGameData();
  const contracts = useContracts();
  const { data: signer } = useQuerySigner();
  const { moves, doors, selectedTokenId } = gameData;
  const { row, col } = gameData.position;

  useEffect(() => {
    (async () => {
      if (!(typeof selectedTokenId === "number")) {
        return;
      }
      try {
        let canUnlock = false;
        if (row === Y_FINAL && col === X_FINAL) {
          const contractSaysFinal = await moveIsFinal({
            characterTokenId: selectedTokenId,
            contracts,
            signer,
          });
          if (!contractSaysFinal) {
            alert(
              "You need to collect the necessary weapons. Battle more minions then come back"
            );
          }
          if (contractSaysFinal) {
            const mazeMovesAreLocallyCorrect = (await calculateProof(moves))
              .answerCorrect;
          }
        }
        if (canUnlock) {
          // Unlock all the doors
          for (let i = 0; i < doors.length; i++) {
            const door = doors[i];
            const newDoors = clone(doors);
            newDoors[i].open = !door.open;
            setGameData({ ...gameData, doors: newDoors });
          }
        }
      } catch (e: any) {
        alert(`Something went wrong: ${e.data?.message || e.message}`);
      }
    })();
  }, [row, col, selectedTokenId, doors, moves, contracts, signer]);
};
