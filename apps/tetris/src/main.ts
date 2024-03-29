import { Board } from "./core/board";
import { TetrisCanvasRenderer } from "./renders/canvas/canvas-render";
import { HTMLRender } from "./renders/html/html-render";
import { MultiRender } from "./renders/multi/multi-render";
import Tetris from "./core/tetris";
import { TextRender } from "./renders/text/text-render";

const height = 800 / devicePixelRatio;
const width = 560 / devicePixelRatio;

const canvasRender = new TetrisCanvasRenderer(
    document.querySelector("#tetrisCanvas")!,
    width,
    height
);

const textRender = new TextRender(document.querySelector("#tetrisText")!);
const htmlRender = new HTMLRender(document.querySelector("#tetrisHTML")!);

const multiRender = new MultiRender(document.querySelector("tetris-header")!, [canvasRender, textRender, htmlRender]);
const board = new Board(height);
const game = new Tetris(board, multiRender);

game.start();
