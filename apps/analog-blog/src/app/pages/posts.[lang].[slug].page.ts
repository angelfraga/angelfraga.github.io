import { MarkdownComponent } from '@analogjs/content';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PostLayoutComponent } from '../layouts/post.component';
import { PostService } from '../services/post.service';


@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, PostLayoutComponent, MarkdownComponent],
  template: ` 
      @if(post$ | async; as post) {
      <afp-blog-post [attributes]="post.attributes">
        <analog-markdown [content]="post.content"></analog-markdown>
      </afp-blog-post>
      } 
  `,
})
export default class BlogPostComponent {
  readonly postService = inject(PostService);
  readonly route = inject(ActivatedRoute)
  readonly post$ = this.postService.getPost(this.route.snapshot.params['lang']);
}