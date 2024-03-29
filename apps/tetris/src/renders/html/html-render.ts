import { TetrisRender, TetrisState } from "../../core/api";


export class HTMLRender implements TetrisRender {
  name = 'html';
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }
  clear(): void {
    this.container.innerHTML = "";

    this.container.style.display = 'none';
  }

  render(state: TetrisState) {

    this.container.style.display = 'grid';
    this.container.innerHTML = "";

    let result = "";
    state.board.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        result += `<div class="cell ${cell.block?.type || ""}" ></div>`;
      });
    });
    if (state.status === "initial") {
      result += `<div class="instructions">Press Enter to start</div>`;
    }
    if (state.status === "gameover") {
      result += `<div class="instructions">Game Over <br> Press R to restart</div>`;
    }
    if (state.status === "pause") {
      result += `<div class="instructions">Press Enter to continue <br> R to restart </div>`;
    }
    this.container.innerHTML = result;

    const next = document.querySelector("#next")!;
    next.innerHTML = "";

    result = "";
    const bricks = Array.from(state.next.bricks);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (
          bricks.some(
            (brick) => x === brick.x - state.next.control.x && y === brick.y
          )
        ) {
          result += `<div class="cell ${state.next.type || ""}" ></div>`;
        } else {
          result += `<div class="cell" ></div>`;
        }
      }
    }
    next.innerHTML = result;
  }
}
