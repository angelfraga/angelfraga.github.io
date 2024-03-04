


import { Component } from "@angular/core"
import { DefaultLayoutComponent } from "./default.component";



@Component({
    standalone: true,
    imports: [DefaultLayoutComponent],
    template: `
    <afp-blog-default [config]="config">
        <div class="container">
            <div class="row">
                <div class="col">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    </afp-blog-default>
    `
})
export class PageLayoutComponent extends DefaultLayoutComponent { }