import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core"
import { DefaultLayoutComponent } from "./default.component";
import { RouterModule } from "@angular/router";
import { PostAttributes } from "../services/post.service";
import LastPostsComponent from "../components/last-post/last-post.component";

@Component({
    standalone: true,
    selector: 'afp-blog-post',
    imports: [CommonModule, DefaultLayoutComponent, RouterModule, LastPostsComponent],
    template: `
    <afp-blog-default [config]="attributes.config">
        <div class="container">
            <div class="row">
                <div class="col">
                    <p>{{ attributes.date | date }}</p>
                    @if(attributes.languages) {
                        @for(lang of attributes.languages; track lang;) {
                            <a attr.href="/posts/{{lang}}/{{attributes.slug}}">
                                <span class="fi fi-{{ lang }}"></span>
                            </a>
                        }
                    }
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <ng-content></ng-content>
                </div> 
                <div class="col-xs-12 col-md-4">
                    <h2>Other posts</h2>
                    <afp-blog-last-posts></afp-blog-last-posts>
                </div> 
            </div>
        </div>
    </afp-blog-default>
    `
})
export class PostLayoutComponent {
    @Input() attributes!: PostAttributes | Record<string, never>;
}