import { MarkdownComponent } from '@analogjs/content';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DefaultLayoutComponent } from '../layouts/default.component';
import { PageService } from '../services/page.service';
import { HomeLayoutComponent } from '../layouts/home.component';

@Component({
  selector: 'afp-blog-page',
  standalone: true,
  imports: [CommonModule, DefaultLayoutComponent, MarkdownComponent, HomeLayoutComponent],
  template: `
  @if(page$ | async; as page) {
    @if(page.attributes.layout === 'default') {
      <afp-blog-default [config]="page?.attributes?.config" >
        <analog-markdown [content]="page.content"></analog-markdown>
      </afp-blog-default>
    }

    @if(page.attributes.layout === 'page') {
      <afp-blog-default [config]="page?.attributes?.config">
        <analog-markdown [content]="page.content"></analog-markdown>
      </afp-blog-default>
    }

    @if(page.attributes.layout === 'home') {
      <afp-blog-home [config]="page?.attributes?.config">
        <analog-markdown [content]="page.content"></analog-markdown>
      </afp-blog-home>
    }
  }
  `,
})
export default class PageComponent {
  readonly pageService = inject(PageService);
  readonly page$ = this.pageService.getPage();
}
