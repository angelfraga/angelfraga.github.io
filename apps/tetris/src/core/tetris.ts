import { Block, createBlock } from "./blocks";

import { fromEvent, interval, BehaviorSubject, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { BlockType, TetrisRender, TetrisState, TetrisStatus, Board } from "./api";

export default class Tetris implements TetrisState {
  intervals = new Set();
  blocks: Block[] = [];
  active?: Block;
  renderer: TetrisRender;
  status: TetrisStatus = "initial";
  next!: Block;

  score = 0;

  playing = new BehaviorSubject(false);
  board: Board;

  #requestAnimationFrameNumber?: number | null;

  constructor(board: Board, renderer: TetrisRender) {
    this.renderer = renderer;
    this.board = board;
  }

  start() {
    this.board.init();

    this.generateBlock();

    this.render();
    this.addListeners();
  }

  addListeners() {
    const keydown$ = fromEvent<KeyboardEvent>(window, "keydown").pipe(
      tap((e) => e.preventDefault())
    );

    const whenPlayingKeydown$ = new Subject<KeyboardEvent>();

    const whenPausedKeydown$ = new Subject<KeyboardEvent>();

    keydown$.subscribe((e) => {
      if (this.playing.getValue()) {
        whenPlayingKeydown$.next(e);
      } else {
        whenPausedKeydown$.next(e);
      }
    });

    const isKey = (key: string) => filter((e: KeyboardEvent) => e.key === key);

    const continue$ = whenPausedKeydown$.pipe(isKey("Enter"));
    const pause$ = whenPlayingKeydown$.pipe(isKey("Enter"));
    const restart$ = whenPausedKeydown$.pipe(isKey("r"));
    const down$ = whenPlayingKeydown$.pipe(isKey("ArrowDown"));
    const left$ = whenPlayingKeydown$.pipe(isKey("ArrowLeft"));
    const right$ = whenPlayingKeydown$.pipe(isKey("ArrowRight"));
    const up$ = whenPlayingKeydown$.pipe(isKey("ArrowUp"));
    const space$ = whenPlayingKeydown$.pipe(isKey(" "));

    const levels = [1000, 500, 250, 100, 80, 50, 20];

    const levelSpeed$ = interval(levels[0]).pipe(filter(() => this.playing.getValue()));

    levelSpeed$.subscribe(() => this.moveBlocksAndCheck());

    left$.subscribe(() => this.moveLeft());

    right$.subscribe(() => this.moveRight());

    down$.subscribe(() => this.moveBlocksAndCheck());

    up$.subscribe(() => this.rotateBlock());

    restart$.subscribe(() => this.restart());

    continue$.subscribe(() => this.play());

    pause$.subscribe(() => this.pause());

    space$.subscribe(() => this.pushDown());
  }

  gameLoop() {
    if (this.playing.getValue()) {
      this.#requestAnimationFrameNumber = requestAnimationFrame(this.gameLoop);
    } else {
      cancelAnimationFrame(this.#requestAnimationFrameNumber!);
      this.#requestAnimationFrameNumber = null;
    }
  }

  moveLeft() {
    if (this.active?.canMoveLeft()) {
      this.active.moveLeft(this.board);
      this.render();
    }
  }

  moveRight() {
    if (this.active?.canMoveRight()) {
      this.active.moveRight(this.board);
      this.render();
    }
  }

  rotateBlock() {
    this.active?.rotate(this.board);
    this.active?.linkCells(this.board);
    this.render();
  }

  pause() {
    this.status = "pause";
    this.playing.next(false);
    this.render();
  }

  play() {
    this.status = "playing";
    this.playing.next(true);
  }

  restart() {
    this.blocks = [];
    this.board.init();
    this.active = undefined;
    this.generateBlock();
    this.status = "initial";
    this.render();
  }

  gameOver() {
    this.playing.next(false);
    this.status = "gameover";
    this.render();
  }

  async pushDown() {
    const active = this.active;
    while (this.active === active) {
      this.moveBlocksAndCheck();
      await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
    }
  }

  moveBlocksAndCheck() {
    try {
      if (this.isTouchingBottom()) {
        this.generateBlock();
        this.cleanRow();
        this.render();
        return;
      }

      if (this.active?.canMoveDown(this.board)) {
        this.active.moveDown(this.board);

        if (!this.active.canMoveDown(this.board)) {
          this.render();
          this.cleanRow();
          this.generateBlock();
        }

        this.render();
        return;
      }

      const gameOver = this.active?.firstY()! > 0;
      if (gameOver) {
        throw new Error("gameover");
      } else {
        this.active = undefined;
        this.generateBlock();
      }
      this.render();
    } catch (error) {
      if (error instanceof Error && error.message === "gameover") {
        this.gameOver();
      }
    }
  }

  cleanRow() {
    this.board.grid.forEach((row, y) => {
      const rowIsFull = !Array.from(row.values()).some((cell) => !cell.block);
      if (rowIsFull) {
        Array.from(row.values()).forEach((cell, x) => {
          const brick = Array.from(cell.block?.bricks!).find(
            (brick) => brick.x === x && brick.y === y
          );
          cell.block?.bricks?.delete(brick!);
          cell.block = null;
        });
        this.blocks.forEach((block) => {
          block.bricks.forEach((brick) => {
            if (brick.y < y) {
              this.board.remove(brick.y, brick.x);
              brick.y++;
            } else if (brick.y === y) {
              // const brick = Array.from(cell.block.bricks).find(
              //   (brick) => brick.x === x && brick.y === y
              // );
              // cell.block.bricks.delete(brick);
              // cell.block = null;
            }
          });
          block.linkCells(this.board);
        });
        this.score++;
        return this.cleanRow();
      }
    });

    this.render();
  }

  isTouchingBottom() {
    const lastRowIndex = this.active?.lastY();
    const isTouchingBottom = lastRowIndex === this.board.size.y - 1;
    return isTouchingBottom;
  }

  /**
   * @returns {Block}
   */
  generateBlock() {
    const blockTypes: BlockType[] = [
      "OBlock",
      "IBlock",
      "LBlock",
      "JBlock",
      "TBlock",
      "ZBlock",
      "SBlock",
    ];

    if (!this.next) {
      let blockType = this.random(blockTypes);
      this.active = createBlock(blockType);
      blockType = this.random(blockTypes);
      this.next = createBlock(blockType);
      this.active.linkCells(this.board);
      this.blocks.push(this.active);
      this.render();
    } else {
      this.active = this.next;

      const blockType = this.random(blockTypes);
      this.next = createBlock(blockType);

      const produceGameOver = !this.active.canMoveDown(this.board);

      this.active.linkCells(this.board);
      this.blocks.push(this.active);
      if (produceGameOver) {
        this.render();
        throw new Error("gameover");
      }
    }
  }

  random<T = any>(list: T[]): T {
    const max = list.length;
    const index = Math.floor(Math.random() * max);
    return list[index];
  }

  render() {
    this.renderer.render(this);
  }
}
