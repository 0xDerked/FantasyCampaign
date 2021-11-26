const path = require("path");
const { F1Field, Scalar } = require("ffjavascript");
exports.p = Scalar.fromString(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);
const Fr = new F1Field(exports.p);

const wasmTester = require("circom_tester").wasm;

const circuitMap = require("../src/Maze/circuitMap");

describe("Circuit tests", () => {
  test("Maze array circuit works", async () => {
    const file = path.resolve(__dirname, "./fixtures/Maze.circom");
    const circuit = await wasmTester(file);

    const witness = await circuit.calculateWitness({}, true);
    const outputs = witness.slice(1, 49);
    const flatMaze = circuitMap.flat();
    outputs.forEach((output, i) => {
      expect(Fr.eq(Fr.e(flatMaze[i]), output)).toBe(true);
    });
  });

  test("TileCodeFromIndex circuit works", async () => {
    const file = path.resolve(__dirname, "./fixtures/TileCodeFromIndex.circom");
    const circuit = await wasmTester(file);

    const promises = MAZE.map((_, i) => async () => {
      const witness = await circuit.calculateWitness({ index: i }, true);
      const output = witness[1];
      expect(Fr.eq(Fr.e(MAZE[i]), output)).toBe(true);
    });
    await Promise.all(promises);
  });

  test("GetNextIndexForMove circuit works", async () => {
    const file = path.resolve(
      __dirname,
      "./fixtures/GetNextIndexForMove.circom"
    );
    const circuit = await wasmTester(file);

    const MOVES = [
      {
        input: [0, 3],
        expected: 1,
      },
      {
        input: [1, 3],
        expected: 2,
      },
      {
        input: [1, 0],
        expected: 7,
      },
      {
        input: [0, 0],
        expected: 6,
      },
    ];

    const promises = MOVES.map(test => async () => {
      const witness = await circuit.calculateWitness(
        { from: test.input[0], direction: test.input[1] },
        true
      );
      const output = witness[1];
      expect(Fr.eq(Fr.e(test.expected), output)).toBe(true);
    });
    await Promise.all(promises);
  });

  test("IsTileOpenForSide circuit works", async () => {
    const file = path.resolve(__dirname, "./fixtures/IsTileOpenForSide.circom");
    const circuit = await wasmTester(file);

    {
      const witness = await circuit.calculateWitness(
        { tileCode: 10, side: 1 }, // User enters or exits tile 10 from top
        true
      );
      expect(Fr.eq(Fr.e(1), witness[1])).toBe(true);
    }
    {
      const witness = await circuit.calculateWitness(
        { tileCode: 10, side: 3 },
        true
      );
      expect(Fr.eq(Fr.e(0), witness[1])).toBe(true);
    }
    {
      const witness = await circuit.calculateWitness(
        { tileCode: 6, side: 3 },
        true
      );
      expect(Fr.eq(Fr.e(0), witness[1])).toBe(true);
    }
    {
      const witness = await circuit.calculateWitness(
        { tileCode: 7, side: 2 },
        true
      );
      expect(Fr.eq(Fr.e(1), witness[1])).toBe(true);
    }
  });

  test("Game circuit works", async () => {
    const file = path.resolve(__dirname, "circuit.circom");
    const circuit = await wasmTester(file);

    const INVALID = 0;
    const VALID = 1;
    const COMPLETE = 2;
    const MAX_MOVES = 20;
    const OUT_OF_RANGE = 100;
    // Valid and incomplete
    {
      const moves = Array(MAX_MOVES).fill(OUT_OF_RANGE); // Sparse array of moves
      [1, 1, 0, 3].forEach((move, index) => {
        moves[index] = move;
      });
      const witness = await circuit.calculateWitness({ moves }, true);
      expect(Fr.eq(Fr.e(VALID), witness[1])).toBe(true);
    }
    // Invalid and incomplete
    {
      const moves = Array(MAX_MOVES).fill(OUT_OF_RANGE); // Sparse array of moves
      [1, 5, 0, 3].forEach((move, index) => {
        moves[index] = move;
      });
      const witness = await circuit.calculateWitness({ moves }, true);
      expect(Fr.eq(Fr.e(INVALID), witness[1])).toBe(true);
    }
    // Invalid and complete
    {
      const moves = Array(MAX_MOVES).fill(OUT_OF_RANGE);
      // second move is invalid
      [1, 7, 0, 3, 0, 0, 1, 2, 1, 0, 0, 1].forEach((move, index) => {
        moves[index] = move;
      });
      const witness = await circuit.calculateWitness({ moves }, true);
      expect(Fr.eq(Fr.e(INVALID), witness[1])).toBe(true);
    }
    // Valid and complete
    {
      const moves = Array(MAX_MOVES).fill(OUT_OF_RANGE);
      [1, 1, 0, 3, 0, 0, 1, 2, 1, 0, 0, 1].forEach((move, index) => {
        moves[index] = move;
      });
      const witness = await circuit.calculateWitness({ moves }, true);
      expect(Fr.eq(Fr.e(COMPLETE), witness[1])).toBe(true);
    }
  });
});
