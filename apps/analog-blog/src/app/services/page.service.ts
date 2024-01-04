import { injectContent, injectContentFiles } from '@analogjs/content';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


export type PageLayout = 'default' | 'page';

export interface Hero {
    title?: string;
    subTitle?: string;
    waves: boolean;
    image?: string;
    cssClass?: string;
}

export interface Colors {
    h: string;
    s: string;
    l: string;
}

export interface PageAttributes<T extends Record<string, any> = object> {
    layout: PageLayout;
    path: string;
    title: string;
    description: string;
    menu: number;
    name: string;
    config: T;
}

export interface DefaultPageAttributes extends PageAttributes {
    layout: 'default';
    path: string;
    title: string;
    description: string;
    config: {
        hero?: Partial<Hero>;
        colors?: Colors;
    };
}

export type SinglePageAttributes = DefaultPageAttributes & { layout: 'page' }

export type AvailablePageAttributes = DefaultPageAttributes | SinglePageAttributes | PageAttributes;

@Injectable({ providedIn: 'root' })
export class PageService {
    router = inject(Router);
    getPage() {
        if (this.router.url === '/') {
            return injectContent<AvailablePageAttributes>({
                customFilename: 'pages/home'
            })
        }

        return injectContent<AvailablePageAttributes>({
            param: 'path',
            subdirectory: `pages`,
        }).pipe(map(contentFile => {
            if (contentFile.attributes.layout) {
                contentFile.attributes.layout = 'default';
            }
            return contentFile;
        }))
    }

    getMenuPages() {
        return injectContentFiles<AvailablePageAttributes>(contentFile =>
            contentFile.filename.includes(`/src/content/pages/`) && !!contentFile.attributes.menu
        ).sort((a, b) => {
            return a.attributes.menu - b.attributes.menu;
        });
    }
}