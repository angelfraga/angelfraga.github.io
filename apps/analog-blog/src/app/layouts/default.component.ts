import { CommonModule } from "@angular/common";
import { Component, HostBinding, Input } from "@angular/core";
import { FooterComponent } from "../components/footer/footer.component";
import { HeaderComponent } from "../components/header/header.component";
import { HeroComponent } from "../components/hero/hero.component";
import { DefaultPageAttributes } from "../services/page.service";

@Component({
    standalone: true,
    selector: 'afp-blog-default',
    imports: [CommonModule, HeaderComponent, HeroComponent, FooterComponent],
    template: `
    <afp-blog-header></afp-blog-header> 
        <afp-blog-hero [hero]="config?.hero" ></afp-blog-hero> 
        <section class="section main d-flex roboto-regular container">
            <ng-content></ng-content>
        </section>
    <afp-blog-footer></afp-blog-footer>
    `,
    styles: [
        `:host { display: flex; height: 100%; flex-direction: column; }`
    ]
})
export class DefaultLayoutComponent {
    @Input() config?: Partial<DefaultPageAttributes['config']>;

    @HostBinding('style') get styles() {
        const colors = {
            ...{
                h: '216',
                s: '85%',
                l: '34%'
            },
            ...(this.config?.colors || {})
        }
        return {
            ['--primary-h']: colors?.h,
            ['--primary-s']: colors?.s,
            ['--primary-l']: colors?.l,
            ['--bs-primary']: 'hsl(var(--primary-h), var(--primary-s), var(--primary-l))'
        }
    }
}
