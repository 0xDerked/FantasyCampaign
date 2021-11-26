export type Position = {
  row: number;
  col: number;
  dir: number; // up : 0, right: 1, down: 2, left: 3
};

export enum GameModes {
  SplashScreen = "SplashScreen",
  SelectingCharacter = "SelectingCharacter",
  ExploringMaze = "ExploringMaze",
  TurnTrigger = "TurnTrigger",
  InCombat = "InCombat",
  Looting = "Looting",
  End = "End",
}

export type GameData = {
  position: Position;
  doors: DoorCoords[];
  spawnPoints: SpawnPointCoords[];
  selectedTokenId: number | null;
  mode: GameModes;
  message: string | null;
  isRollingDice: boolean;
};

export type CharacterAbilities = {
  abilityType: number;
  action: number;
  name: string;
};

export type CharacterAttributes = {
  tokenId?: number;
  id: number;
  agility: number;
  armor: number;
  experience?: number;
  healingpower: number;
  health: number;
  name: string;
  physicalblock: number;
  spellpower: number;
  spellresistance: number;
  strength: number;
  abilities: CharacterAbilities[];
};

export type CharacterStatsDictionary = Record<string, CharacterAttributes>;

export enum CharacterClass {
  Knight = 0,
  Warlord = 1,
  Wizard = 2,
  Shaman = 3,
  Cleric = 4,
  Rogue = 5,
  Ranger = 6,
  Warlock = 7,
}

export type Item = {
  attr: number;
  item: number;
  name: string;
  numUses: number;
  power: number;
};

export enum TurnType {
  NotSet,
  Combat,
  Loot,
  Puzzle,
}

export enum WallType {
  Wall1 = 0,
  Wall2 = 1,
  Door = 2,
}

export type DoorCoords = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  open: boolean;
  id: number;
};

export type DoorsDict = Record<`${number},${number}`, boolean>;

export type WallCoords = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: WallType.Wall1 | WallType.Wall2;
};

export type WallsDict = Record<
  `${number},${number},${number},${number}`,
  boolean
>;

export type SpawnPointCoords = {
  x: number;
  y: number;
};

export type SpawnPointsDict = Record<`${number},${number}`, boolean>;

export type RPCError = {
  code: number;
  message: string;
  data: {
    code: number;
    message: number;
  };
};
