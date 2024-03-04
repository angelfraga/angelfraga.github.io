import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'afp-blog-header',
  templateUrl: 'header.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule],
  styles: [
    `
      :host {
        z-index: 2; 
         
      }
      :host .container {
        height: 54px;
        align-items: center;
      }
      :host nav .container, ul { 
        display: flex;
        flex-direction: row;
        z-index: 2;
      }
      ul {
        margin: 0;
      }
      .navbar-nav {
        list-style: none;
      }
      .nav-link {
        color: white;
        padding: 1em;
      }
      button {
        padding: 1em;
        background: transparent;
        border: none;
        cursor: pointer;
      }
      `
  ]
})

export class HeaderComponent {

  darkMode = false;

  storageService = inject(StorageService);
  pageService = inject(PageService);
  links: { path: string; label: string }[] = [
    ...this.pageService.getMenuPages().map(page => ({ path: page.attributes.path, label: page.attributes.name }))
  ];

  loadTheme() {
    this.darkMode = this.storageService.getItem('darkMode') || false;
    if (this.darkMode) {
      document.body.classList.add('dark');
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark');
    this.storageService.setItem('darkMode', this.darkMode)
  }
}
