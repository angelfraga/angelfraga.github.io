import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostService } from '../../services/post.service';


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
    selector: 'afp-blog-last-posts',
    imports: [CommonModule, PostCardComponent],
    template: `
    <div class="posts"
        style="--posts-columns: 1"> 
        @for (post of posts; track $index) {
            <afp-blog-post-card [post]="post.attributes"></afp-blog-post-card> 
        }
    </div>
  `,
})
export default class LastPostsComponent {
    readonly postService = inject(PostService);
    readonly route = inject(ActivatedRoute)
    readonly posts = this.postService.getLatestPosts(this.route.snapshot.params['lang']);
}