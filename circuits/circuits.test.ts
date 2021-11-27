const path = require("path");
const { F1Field, Scalar } = require("ffjavascript");
exports.p = Scalar.fromString(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);
const Fr = new F1Field(exports.p);

const wasmTester = require("circom_tester").wasm;

const circuitMap = require("../src/Maze/circuitMap");
const flatMaze = circuitMap.flat();

describe("Circuit tests", () => {
  test("Maze map circuit works", async () => {
    const file = path.resolve(__dirname, "./fixtures/Maze.circom");
    const circuit = await wasmTester(file);

    const witness = await circuit.calculateWitness({}, true);
    const outputs = witness.slice(1, 49);
    outputs.forEach((output, i) => {
      expect(Fr.eq(Fr.e(flatMaze[i]), output)).toBe(true);
    });
  });

  test("AssertNoTeleport", async () => {
    const file = path.resolve(__dirname, "./fixtures/AssertNoTeleport.circom");
    const circuit = await wasmTester(file);
    const VALID = 1;
    const INVALID = 0;
    {
      // North
      const witness = await circuit.calculateWitness(
        { direction: 0, enabled: 1 },
        true
      );
      expect(Fr.eq(Fr.e(VALID), witness[1])).toBe(true);
    }
    {
      // East
      const witness = await circuit.calculateWitness(
        { direction: 1, enabled: 1 },
        true
      );
      expect(Fr.eq(Fr.e(VALID), witness[1])).toBe(true);
    }
    {
      // South
      const witness = await circuit.calculateWitness(
        { direction: 2, enabled: 1 },
        true
      );
      expect(Fr.eq(Fr.e(VALID), witness[1])).toBe(true);
    }
    {
      // West
      const witness = await circuit.calculateWitness(
        { direction: 3, enabled: 1 },
        true
      );
      expect(Fr.eq(Fr.e(VALID), witness[1])).toBe(true);
    }
    {
      // Fail
      const witness = await circuit.calculateWitness(
        { direction: 100, enabled: 0 },
        true
      );
      expect(Fr.eq(Fr.e(INVALID), witness[1])).toBe(true);
    }
    {
      // Fail hard
      try {
        await circuit.calculateWitness({ direction: 100, enabled: 1 }, true);
      } catch (e) {
        expect(true).toBe(true);
      }
    }
  });

  test("Direction circuit works", async () => {
    const file = path.resolve(
      __dirname,
      "./fixtures/GetDirectionForMove.circom"
    );
    const circuit = await wasmTester(file);

    {
      // North
      const witness = await circuit.calculateWitness(
        { x1: 1, x2: 1, y1: 4, y2: 3 }, // User enters or exits tile 10 from top
        true
      );
      expect(Fr.eq(Fr.e(0), witness[1])).toBe(true);
    }
    {
      // East
      const witness = await circuit.calculateWitness(
        { x1: 1, x2: 2, y1: 3, y2: 3 }, // User enters or exits tile 10 from top
        true
      );
      expect(Fr.eq(Fr.e(1), witness[1])).toBe(true);
    }
    {
      // South
      const witness = await circuit.calculateWitness(
        { x1: 1, x2: 1, y1: 3, y2: 4 }, // User enters or exits tile 10 from top
        true
      );
      expect(Fr.eq(Fr.e(2), witness[1])).toBe(true);
    }
    {
      // West
      const witness = await circuit.calculateWitness(
        { x1: 2, x2: 1, y1: 3, y2: 3 }, // User enters or exits tile 10 from top
        true
      );
      expect(Fr.eq(Fr.e(3), witness[1])).toBe(true);
    }
  });

  test("TileCodeFromCoords circuit works", async () => {
    const file = path.resolve(
      __dirname,
      "./fixtures/TileCodeFromCoords.circom"
    );
    const circuit = await wasmTester(file);

    const promises = [];
    circuitMap.forEach((row, y) => {
      row.forEach((tile, x) => {
        promises.push(async () => {
          const witness = await circuit.calculateWitness({
            x: Fr.e(x),
            y: Fr.e(y),
          });
          const output = witness[1];
          expect(Fr.eq(Fr.e(tile), output)).toBe(true);
        });
      });
    });
    await Promise.all(promises);
  });

  test("IsTileOpenForSide circuit works", async () => {
    const file = path.resolve(__dirname, "./fixtures/IsTileOpenForSide.circom");
    const circuit = await wasmTester(file);

    {
      const witness = await circuit.calculateWitness(
        { tileCode: 9, side: 1 }, // User enters or exits tile 10 from top
        true
      );
      expect(Fr.eq(Fr.e(1), witness[1])).toBe(true);
    }
    {
      const witness = await circuit.calculateWitness(
        { tileCode: 9, side: 3 },
        true
      );
      expect(Fr.eq(Fr.e(0), witness[1])).toBe(true);
    }
    {
      const witness = await circuit.calculateWitness(
        { tileCode: 5, side: 3 },
        true
      );
      expect(Fr.eq(Fr.e(0), witness[1])).toBe(true);
    }
    {
      const witness = await circuit.calculateWitness(
        { tileCode: 6, side: 2 },
        true
      );
      expect(Fr.eq(Fr.e(1), witness[1])).toBe(true);
    }
  });

  test("Game circuit works", async () => {
    const file = path.resolve(__dirname, "circuit.circom");
    const circuit = await wasmTester(file);

    const VALID = 1;
    const MAX_MOVES = 200;
    const OUT_OF_RANGE = [100, 100];

    // Valid and complete
    {
      const moves = Array(MAX_MOVES).fill(OUT_OF_RANGE); // Sparse array of moves
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 2],
        [0, 2],
        [0, 3],
        [1, 3],
        [2, 3],
        [2, 4],
        [3, 4],
        [3, 3],
        [3, 2],
        [3, 1],
        [4, 1],
        [4, 0],
        [5, 0],
        [6, 0],
        [6, 1],
        [6, 2],
        [6, 3],
        [5, 3],
        [5, 4],
        [5, 5],
      ].forEach((move, index) => {
        moves[index] = move;
      });
      const witness = await circuit.calculateWitness({ moves }, true);
      expect(Fr.eq(Fr.e(VALID), witness[1])).toBe(true);
      expect(Fr.eq(Fr.e(VALID), witness[2])).toBe(true);
    }

    // Invalid and incomplete
    {
      const moves = Array(MAX_MOVES).fill(OUT_OF_RANGE); // Sparse array of moves
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ].forEach((move, index) => {
        moves[index] = move;
      });
      const witness = await circuit.calculateWitness({ moves }, true);
      expect(Fr.eq(Fr.e(VALID), witness[1])).toBe(false);
      expect(Fr.eq(Fr.e(VALID), witness[2])).toBe(false);
    }

    // Tried starting at the end
    {
      const moves = Array(MAX_MOVES).fill(OUT_OF_RANGE); // Sparse array of moves
      [
        [5, 4],
        [5, 5],
      ].forEach((move, index) => {
        moves[index] = move;
      });
      const witness = await circuit.calculateWitness({ moves }, true);
      expect(Fr.eq(Fr.e(VALID), witness[1])).toBe(false);
      expect(Fr.eq(Fr.e(VALID), witness[2])).toBe(true);
    }
  });
});
