import { TetrisRender, TetrisState } from "../core/api";

export class TextRender implements TetrisRender {
  name = 'textarea';
  textarea: HTMLTextAreaElement;

  constructor(textarea: HTMLTextAreaElement) {
    this.textarea = textarea;
  }
  clear(): void {
    this.textarea.value = '';
    this.textarea.style.display = 'none';
  }

  render(state: TetrisState) {
    this.textarea.style.display = 'block';
    let result = "";

    const blocksColors = {
      "": "black",
      IBlock: "#00ffff",
      OBlock: "#f0f000",
      LBlock: "#f0a000",
      JBlock: "#0000f1",
      TBlock: "#a000f0",
      ZBlock: "#f00000",
      SBlock: "#00f000",
    };

    if (state.status === "playing") {
      this.textarea.style.color = blocksColors[state.active!.type];
    } else {
      this.textarea.style.color = "red";
    }

    state.board.grid.forEach((row, y) => {
      if (state.status === "initial" && y === 9) {
        result += "   Press Enter To start   ";
      }
      if (state.status === "pause") {
        if (y === 9) result += " Press Enter to continue ";
        if (y === 10) result += "        R to start         ";
      }

      if (state.status === "gameover") {
        if (y === 9) result += "        Game Over         ";
        if (y === 10) result += "        R to start         ";
      }
      if (state.status === "playing") {
        result += y.toString().padStart(2, " ") + "|";
        const blocks = {
          "": "",
          OBlock: "O",
          IBlock: "I",
          LBlock: "L",
          JBlock: "J",
          TBlock: "T",
          ZBlock: "Z",
          SBlock: "S",
        };
        row.forEach((cell, x) => {
          result += `${blocks[cell.block?.type || ""]
            .toString()
            .padStart(x === 0 ? 1 : 2, " ")}`;
        });
        result += "|" + y.toString().padStart(2, " ");
      }
      result += "\r\n";
    });
    this.textarea.value = result;
  }
}
