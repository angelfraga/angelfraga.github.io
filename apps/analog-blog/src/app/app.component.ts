import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'afp-blog-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet></router-outlet> `,
  styles: [
    `
    :host {
      min-height: 100%
    }
    `
  ]
})
export class AppComponent { }
