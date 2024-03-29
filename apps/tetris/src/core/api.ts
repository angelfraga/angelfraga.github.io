
export interface Point {
    x: number;
    y: number;
}

export class Cell implements Point {
    y: number;
    x: number;
    block: Block | null;

    constructor(y: number, x: number) {
        this.y = y;
        this.x = x;
        this.block = null;
    }
}

export interface Board {

    grid: Map<number, Map<number, Cell>>;
    height: number;
    cellSize: number;
    size: Point;

    remove(y: number, x: number): void;

    init(): void;

    createGrid(): void;
}

export type Grid = Map<number, Map<number, Cell>>;

export interface BoardRender {
    render(board: Board): void;
}

export type BlockType = 'OBlock' | 'IBlock' | 'LBlock' | 'JBlock' |
    'TBlock' |
    'ZBlock' |
    'SBlock';

export type TetrisStatus = 'pause' | 'gameover' | 'initial' | 'playing';

export interface TetrisState {
    board: Board;
    next: Block;
    status: TetrisStatus;
    active?: Block;
    score: number;
}

export interface TetrisRender {
    name: string;
    render(state: TetrisState): void;
    clear(): void;
}

export interface TetrisStatusRender {
    render(status: TetrisStatus): void;
}


export interface Block {
    bricks: Set<Point>;
    control: Point;
    id: number;
    size: number;
    type: BlockType;

    linkCells(board: Board): void;

    clearCells(board: Board): void;

    moveLeft(board: Board): void;

    moveRight(board: Board): void;

    moveDown(board: Board): void;

    rotate(board: Board): void;

    rotateMatrix90Deg(matrix: number[][]): void;

    toMatrix(): number[][];

    assignMatrix(matrix: number[][], board: Board): void;

    firstY(): number;

    lastY(): number;

    canMoveDown(board: Board): boolean;

    canMoveLeft(): boolean;

    canMoveRight(): boolean;

    removeBrick(x: number, y: number): void;
}