import { Block, Point, createBlock } from "./blocks.js";
import { Board } from "./board.js";

describe("Roate", () => {
  test("T", () => {
    const board = new Board(20);
    board.init();
    const block = createBlock("TBlock");

    block.toMatrix();

    expect(block.toMatrix()).toEqual([
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ]);
  });
});
