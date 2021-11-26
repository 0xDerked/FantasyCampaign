const fs = require("fs");
const path = require("path");

const circuitMap = require("../src/Maze/circuitMap");

const OUT_FILE = path.resolve(__dirname, "./functions/getMaze.circom");

const SIZE = circuitMap.length;

const template = `pragma circom 2.0.0;

function getMaze() {
  var maze[${SIZE}] = ${JSON.stringify(circuitMap, null, 2)}
  return maze;
}
`;

fs.writeFileSync(OUT_FILE, template, "utf8");
