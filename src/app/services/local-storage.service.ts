import { Injectable } from '@angular/core';

export const BOARDS_APP_KEY = 'BOARDS_APP_KEY_VERY_COOL_VERY_NICE';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setKey(key: string, value: string): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getKey(key: string): any | null {
    const  value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    }

    return null;
  }
}
