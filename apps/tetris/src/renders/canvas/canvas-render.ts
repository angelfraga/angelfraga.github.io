import { Block, Board, Cell, TetrisRender, TetrisState, TetrisStatus } from "../../core/api";

interface BlockCache {
  image: ImageData;
  x: number;
  y: number;
}

export class TetrisCanvasRenderer implements TetrisRender {
  name = 'canvas';
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  previousNext?: Block;
  previousNextImageData?: BlockCache;

  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx = canvas.getContext("2d")!;
  }

  render(state: TetrisState) {
    this.canvas.style.display = 'inline-block';

    this.canvas.style.width = this.canvas.width / devicePixelRatio + "px";
    this.canvas.style.height = this.canvas.height / devicePixelRatio + "px";

    this.clearCanvas();

    state.board.grid.forEach((row) => {
      row.forEach((cell) => this.renderCell(cell, state.board.cellSize));
    });

    this.renderNext(state.next, state.board.cellSize);
    this.renderScore(state.score);
    this.renderStatus(state.status, state.board);
  }

  clear() {
    this.clearCanvas()
    this.canvas.style.display = 'none';
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderCell(cell: Cell, cellSize: number) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgb(15, 15, 15)";

    const left = cell.x * cellSize;
    const top = cell.y * cellSize;

    this.ctx.rect(left, top, cellSize, cellSize);

    this.ctx.stroke();

    this.ctx.fillStyle = cell.block
      ? this.getBlockColor(cell.block)
      : "rgb(34, 34, 34)";

    this.ctx.fill();

    this.ctx.closePath();
    this.ctx.restore();
  }

  /**
   *
   * @param {Block} block
   */
  getBlockColor(block: Block) {
    const COLORS = {
      IBlock: "#00ffff",
      OBlock: "#f0f000",
      LBlock: "#f0a000",
      JBlock: "#0000f1",
      TBlock: "#a000f0",
      ZBlock: "#f00000",
      SBlock: "#00f000",
    };

    return COLORS[block.type] || "black";
  }

  renderStatus(status: TetrisStatus, board: Board) {
    const fontSize = this.canvas.height / board.size.y;
    switch (status) {
      case "initial":
        this.addTextBackdrop();
        return this.addCenteredText("Press Enter to start", fontSize);
      case "gameover":
        this.addTextBackdrop();
        this.addCenteredText("GameOver", fontSize);
        this.addBottomText("R to restart", fontSize);
        break;
      case "pause":
        this.addTextBackdrop();
        this.addCenteredText("Enter to continue", fontSize);
        this.addBottomText("R to restart", fontSize);
        break;
    }
  }

  addTextBackdrop() {
    this.ctx.save();
    this.ctx.beginPath();

    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.stroke();

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }

  addCenteredText(text: string, fontSize: number) {
    this.ctx.save();
    this.ctx.font = fontSize + "px arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.shadowColor = "black";
    this.ctx.shadowBlur = 7;
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.restore();
  }

  addBottomText(text: string, fontSize: number) {
    this.ctx.save();
    this.ctx.font = fontSize + "px arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.shadowColor = "black";
    this.ctx.shadowBlur = 7;
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 1.5);
    this.ctx.restore();
  }

  renderNext(next: Block, cellSize: number) {
    if (!next) return;
    if (this.previousNext === next) {
      this.ctx.putImageData(
        this.previousNextImageData!.image,
        this.previousNextImageData!.x,
        this.previousNextImageData!.y
      );
      return;
    }

    const matrix = next.toMatrix();

    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(15, 15, 15)";

        const left = 440 + (x * cellSize) / 2;
        const top = 40 + (y * cellSize) / 2;

        this.ctx.rect(left, top, cellSize / 2, cellSize / 2);
        this.ctx.stroke();

        this.ctx.fillStyle = cell
          ? this.getBlockColor(next)
          : "rgb(34, 34, 34)";

        this.ctx.fill();

        this.ctx.closePath();
        this.ctx.restore();
      });
    });

    this.previousNext = next;
    this.previousNextImageData = {
      image: this.ctx.getImageData(400, 0, 560, 160),
      x: 400,
      y: 0,
    };
  }

  renderScore(score: number) {
    this.ctx.save();
    this.ctx.font = "18px arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.shadowColor = "black";
    this.ctx.fillText(`Score: ${score}`, 440, 160);
    this.ctx.restore();
  }
}
