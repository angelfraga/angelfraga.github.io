import { MarkdownComponent } from '@analogjs/content';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PostCardComponent } from '../components/post-card/post-card.component';
import { DefaultLayoutComponent } from '../layouts/default.component';
import { PostService } from '../services/post.service';


export interface PostAttributes {
  author: string;
  title: string;
  date: Date;
  slug: string;
  description: string;
  coverImage: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, DefaultLayoutComponent, MarkdownComponent, PostCardComponent],
  template: `
    <afp-blog-default>
      <div class="container d-flex flex-column">
        <div class="row">
            <div class="col">
              
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <!-- {% include pagination.html %} -->
            </div>
        </div>
        <div class="posts"
            style="--posts-columns: 3"> 
            @for (post of posts; track $index) {
             <afp-blog-post-card [post]="post.attributes"></afp-blog-post-card> 
            }
        </div>
        <div class="row">
            <div class="col-12">
                <!-- {% assign totalPages = en_posts.size | divided_by: itemsPerPage %}
                {% include pagination.html pageNumber=paginator.page totalPages=totalPages %} -->
            </div>
        </div>
      </div>
    </afp-blog-default>
  `,
})
export default class BlogComponent {
  readonly postService = inject(PostService);
  readonly route = inject(ActivatedRoute)
  readonly posts = this.postService.getPosts(this.route.snapshot.params['lang'], this.route.snapshot.params['page']);
}