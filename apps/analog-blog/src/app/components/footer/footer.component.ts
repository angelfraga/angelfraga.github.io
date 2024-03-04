import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'afp-blog-footer',
    templateUrl: 'footer.component.html',
    styleUrl: 'footer.component.scss',
    imports: [RouterLink]
})

export class FooterComponent {
}