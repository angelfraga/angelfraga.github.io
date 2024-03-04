import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

    readonly storage = new Map<string, unknown>();

    getItem<T>(key: string): T {
        if (isPlatformBrowser(PLATFORM_ID)) {
            return JSON.parse(localStorage.getItem(key) || 'null') as T;
        }

        return this.storage.get(key) as T;
    }

    setItem<T = unknown>(key: string, value: T) {

        if (isPlatformBrowser(PLATFORM_ID)) {
            localStorage.setItem(key, JSON.stringify(value || null));
            return;
        }

        this.storage.set(key, value);
    }
}