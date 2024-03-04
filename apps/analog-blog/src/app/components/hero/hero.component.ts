import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Hero } from '../../services/page.service';

@Component({
    standalone: true,
    selector: 'afp-blog-hero',
    templateUrl: 'hero.component.html',
    styleUrl: 'hero.component.scss',
    encapsulation: ViewEncapsulation.None
})

export class HeroComponent {
    @Input() hero?: Partial<Hero>;
}