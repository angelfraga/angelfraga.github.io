import { CommonModule } from "@angular/common";
import { Component, Input, ViewEncapsulation } from "@angular/core"
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
            </div>
        </div>
    </afp-blog-default>
    `,
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
        nav {
            background: #0f0f11;
        }
        .hero {
            background: none !important;
        }
        .hero:before {
            content: "";
            background: linear-gradient(130deg, #ff6c00, #af002d 41.07%, #980bff 76.05%);
            position: absolute;
            top: -5px;
            left: -5px;
            width: calc(100% + 10px);
            height: calc(100% + 10px);
            z-index: -1;
            border-radius: 12px;
        }
        `
    ]
})
export class PostLayoutComponent {
    @Input() attributes!: PostAttributes | Record<string, never>;
    get config() {
        return { ...this.attributes.config, hero: undefined }
    }
}