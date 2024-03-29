import { TetrisRender, TetrisState } from "../../core/api";

export class MultiRender implements TetrisRender {
  name = 'multi';

  #renders: TetrisRender[];
  container: HTMLDivElement;

  active: TetrisRender;

  #lastState?: TetrisState;

  constructor(container: HTMLDivElement, renders: TetrisRender[]) {
    this.#renders = renders;
    this.container = container;
    this.active = renders[0];

    this.init();
  }

  clear(): void {
    this.active.clear();
  }

  render(state: TetrisState) {
    this.#lastState = state;
    this.active.render(state);
  }

  select(name: string) {
    this.active.clear();
    this.active = this.#renders.find(render => render.name === name)!;
    if (this.#lastState) {
      this.active.render(this.#lastState);
    }
  }

  init() {

    this.#renders.forEach(render => {
      const id = `${render.name}Render`;
      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = `${render.name.toLocaleUpperCase()} Render`
      this.container.appendChild(label);

      const input = document.createElement('input');
      input.setAttribute('type', 'radio');
      input.setAttribute('name', 'render');
      input.setAttribute('value', render.name);
      input.setAttribute('id', id);

      input.checked = this.active === render;

      input.addEventListener('input', event => this.select((event.target as HTMLInputElement).value))

      this.container.appendChild(input);
    });
  }
}
