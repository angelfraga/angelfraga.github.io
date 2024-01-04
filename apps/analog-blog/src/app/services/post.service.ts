import { ContentFile, injectContent, injectContentFiles } from '@analogjs/content';
import { Injectable } from '@angular/core';
import { DefaultPageAttributes } from './page.service';


export interface PostAttributes extends DefaultPageAttributes {
    author: string;
    title: string;
    date: Date;
    slug: string;
    description: string;
    coverImage: string;
    lang: string;
    languages: string[];
}


function toDate(contentFile: ContentFile<PostAttributes>): Date {
    return new Date(contentFile.attributes.date)
}

@Injectable({ providedIn: 'root' })
export class PostService {
    getPost(lang: string) {
        lang = lang === 'blog' ? 'en' : lang;
        return injectContent<PostAttributes>({
            param: 'slug',
            subdirectory: `posts/${lang}`,
        })
    }

    getLatestPosts(lang = 'en', size = 5) {
        return this.getPosts(lang, 1, size);
    }

    getPosts(lang = 'en', page = 1, size = 10) {
        lang = lang === 'blog' ? 'en' : lang;
        const from = page * size - size;
        const to = from + size;
        return injectContentFiles<PostAttributes>(contentFile =>
            contentFile.filename.includes(`/src/content/posts/${lang}`) && toDate(contentFile).getTime() <= new Date().getTime()
        ).sort((a, b) => {
            return toDate(a).getTime() - toDate(b).getTime()
        }).slice(from, to);
    }
}