import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFileRouter } from '@analogjs/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';


import "prismjs/plugins/toolbar/prism-toolbar.min.js"

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(),
    provideClientHydration(),
    provideHttpClient(),
    provideContent(withMarkdownRenderer()),
  ],
};
