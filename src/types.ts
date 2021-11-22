export type Position = {
  row: number;
  col: number;
  dir: number; // up : 0, right: 1, down: 2, left: 3
};

export enum Routes {
  Splash = "Splash",
  CreateCharacter = "CreateCharacter",
  StartCampaign = "StartCampaign",
  Maze = "Maze",
}

export type GameData = {
  position: Position;
  walls: WallCoords[];
  doors: DoorCoords[];
  spawnPoints: SpawnPointCoords[];
  isFighting: boolean;
  gameMode: GameMode;
  characterClass: CharacterClass | null;
  route: Routes;
};

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
export enum GameMode {
  CreateCharacter = "CreateCharacter",
  Navigation = "Navigation",
  Fight = "Fight",
  Puzzle = "Puzzle",
  Looting = "Looting",
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
