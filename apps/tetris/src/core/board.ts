import { Cell, Board as IBoard, Point } from "./api";

export class Board implements IBoard {
  private static Y_CELLS = 20;
  private static X_CELLS = 10;

  grid: Map<number, Map<number, Cell>> = new Map();
  height: number;
  cellSize: number = 0;

  constructor(height: number) {
    this.height = height;
  }

  get size(): Point {
    return {
      x: Board.X_CELLS,
      y: Board.Y_CELLS
    };
  }

  remove(y: number, x: number) {
    const cell = this.grid.get(y)?.get(x);
    if (cell) {
      cell.block = null;
    }
  }

  init() {
    this.cellSize = this.height / Board.Y_CELLS;
    this.createGrid();
  }

  createGrid() {
    this.grid = new Map();
    new Array(Board.Y_CELLS).fill(0).forEach((row, y) => {
      const rowMap = new Map();
      this.grid.set(y, rowMap);
      new Array(Board.X_CELLS).fill(0).forEach((cell, x) => {
        rowMap.set(x, new Cell(y, x));
      });
    });
  }
}
