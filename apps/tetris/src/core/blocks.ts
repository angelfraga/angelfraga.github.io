import { BlockType, Board } from "./api";

let blockCounter = 1;

export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Block implements Block {
  bricks: Set<Point>;
  control: Point;
  id: number;
  size: number = 3;
  type: BlockType;

  constructor(type: BlockType, control: Point, points: Point[], size: number) {
    this.id = blockCounter++;
    this.bricks = new Set(points);
    this.control = control;
    this.type = type;
    this.size = size;
  }

  linkCells(board: Board) {
    this.bricks.forEach((brick) => {
      const cell = board.grid?.get(brick.y)?.get(brick.x)!;
      cell.block = this;
    });
  }

  clearCells(board: Board) {
    this.bricks.forEach((brick) => {
      const cell = board.grid.get(brick.y)?.get(brick.x)!;
      cell.block = null;
    });
  }

  moveLeft(board: Board) {
    this.control.x--;
    this.bricks.forEach((brick) => {
      const cell = board.grid.get(brick.y)?.get(brick.x)!;
      cell.block = null;
      brick.x = Math.max(brick.x - 1, 0);
    });
    this.linkCells(board);
  }

  moveRight(board: Board) {
    this.control.x++;
    this.bricks.forEach((brick) => {
      const cell = board.grid.get(brick.y)?.get(brick.x)!;
      cell.block = null;
      brick.x = Math.max(brick.x + 1, 0);
    });
    this.linkCells(board);
  }

  moveDown(board: Board) {
    this.control.y++;
    this.bricks.forEach((brick) => {
      const cell = board.grid.get(brick.y)?.get(brick.x)!;
      cell.block = null;

      brick.y++;
    });

    this.linkCells(board);
  }

  rotate(board: Board) {
    let matrix;
    try {
      matrix = this.toMatrix();
      const newMatrix = this.rotateMatrix90Deg(matrix);

      // check

      this.assignMatrix(newMatrix, board);
    } catch (error) {
      if (matrix) {
        this.assignMatrix(matrix, board);
      }
    }
  }

  rotateMatrix90Deg(matrix: number[][]) {
    const newMatrix = Array.from(Array(this.size), () =>
      new Array(this.size).fill(0)
    );
    const n = this.size;
    // rotate matrix
    matrix.forEach((row, y) => {
      row.forEach((_cell, x) => {
        if (matrix[y][x] === 1) {
          newMatrix[x][n - y - 1] = matrix[y][x];
        }
      });
    });

    return newMatrix;
  }

  toMatrix() {
    const matrix = Array.from(Array(this.size), () =>
      new Array(this.size).fill(0)
    );
    this.bricks.forEach((brick) => {
      const deltaX = brick.x - this.control.x;
      const deltaY = brick.y - this.control.y;

      matrix[deltaY][deltaX] = 1;
    });
    return matrix;
  }

  assignMatrix(matrix: number[][], board: Board) {
    // assign
    this.clearCells(board);
    this.bricks.clear();

    matrix.forEach((row, y) => {
      row.forEach((_cell, x) => {
        if (matrix[y][x] === 1) {
          this.bricks.add(new Point(x + this.control.x, y + this.control.y));
        }
      });
    });
  }

  firstY() {
    return Math.min(...Array.from(this.bricks).map((brick) => brick.y));
  }

  lastY() {
    return Math.max(...Array.from(this.bricks).map((brick) => brick.y));
  }

  canMoveDown(board: Board): boolean {
    return !Array.from(this.bricks).some((brick) => {
      const yDelta = brick.y + 1;
      const cellDelta = board.grid.get(yDelta)?.get(brick.x);

      return !cellDelta || (cellDelta.block !== this && !!cellDelta.block);
    });
  }

  canMoveLeft() {
    return !Array.from(this.bricks).some((brick) => brick.x === 0);
  }

  canMoveRight() {
    return !Array.from(this.bricks).some((brick) => brick.x === 9);
  }

  removeBrick(x: number, y: number) {
    let brick: Point | null = null;
    for (let point of this.bricks) {
      if (point.x == x && y == point.y) {
        brick = point;
        break;
      }
    }
    if (brick) {
      this.bricks.delete(brick);
    }
  }
}

export function createBlock(blockType: BlockType) {
  let size = 3;
  let points;
  let control = new Point(3, 0);
  switch (blockType) {
    case "OBlock":
      size = 2;
      points = [
        new Point(4, 0),
        new Point(5, 0),
        new Point(4, 1),
        new Point(5, 1),
      ];
      control = new Point(4, 0);
      break;
    case "IBlock":
      size = 4;
      points = [
        new Point(4, 0),
        new Point(4, 1),
        new Point(4, 2),
        new Point(4, 3),
      ];
      break;
    case "LBlock":
      points = [
        new Point(4, 0),
        new Point(4, 1),
        new Point(4, 2),
        new Point(5, 2),
      ];
      break;
    case "JBlock":
      points = [
        new Point(4, 0),
        new Point(4, 1),
        new Point(4, 2),
        new Point(3, 2),
      ];
      break;
    case "TBlock":
      points = [
        new Point(3, 0),
        new Point(4, 0),
        new Point(5, 0),
        new Point(4, 1),
      ];
      break;
    case "ZBlock":
      points = [
        new Point(3, 0),
        new Point(4, 0),
        new Point(4, 1),
        new Point(5, 1),
      ];
      break;
    case "SBlock":
      points = [
        new Point(4, 0),
        new Point(5, 0),
        new Point(4, 1),
        new Point(3, 1),
      ];
      break;
  }
  return new Block(blockType, control, points, size);
}
