import { useCallback, useEffect, useRef } from "react";
import { useGameData } from "../providers/GameData";

enum Events {
  CampaignStarted = "CampaignStarted",
  CampaignEnded = "CampaignEnded",
  TurnSet = "TurnSet",
  TurnStarted = "TurnStarted",
  TurnCompleted = "TurnCompleted",
  MobAttack = "MobAttack",
}

const contractMock = {
  on(...args: any[]) {
    //
  },
  removeAllListeners(...args: any[]) {
    //
  },
};

export const useContractListeners = () => {
  const [gameState] = useGameData();
  const campaignStartedListener = useCallback(() => {
    //
  }, []);
  const campaignEndedListener = useCallback(() => {
    //
  }, []);
  const turnSetListener = useCallback(() => {
    //
  }, []);
  const turnStartedListener = useCallback(() => {
    //
  }, []);
  const turnCompletedListener = useCallback(() => {
    //
  }, []);
  const mobAttackListener = useCallback(() => {
    //
  }, []);

  useEffect(() => {
    contractMock.on(Events.CampaignStarted, campaignStartedListener);
    contractMock.on(Events.CampaignEnded, campaignEndedListener);
    contractMock.on(Events.TurnSet, turnSetListener);
    contractMock.on(Events.TurnStarted, turnStartedListener);
    contractMock.on(Events.TurnCompleted, turnCompletedListener);
    contractMock.on(Events.MobAttack, mobAttackListener);
    return () => {
      [
        Events.CampaignStarted,
        Events.CampaignEnded,
        Events.TurnSet,
        Events.TurnStarted,
        Events.TurnCompleted,
        Events.MobAttack,
      ].forEach(event => {
        contractMock.removeAllListeners(event);
      });
    };
  }, []);
};
