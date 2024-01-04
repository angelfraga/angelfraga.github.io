import { Component, Input } from '@angular/core';
import { PostAttributes } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'afp-blog-post-card',
    templateUrl: 'post-card.component.html',
    styleUrl: 'post-card.component.scss',
    imports: [CommonModule, RouterModule]
})

export class PostCardComponent {
    @Input() post?: PostAttributes;
}