import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  #document = inject(DOCUMENT);

  public toggleDarkMode(force?: boolean) {
    const className = this.#document.documentElement.className;
    if (isNotNullOrUndefined(force)) {
      this.#document.documentElement.className = force ? 'dark' : '';
      return;
    }

    this.#document.documentElement.className = !className ? 'dark' : '';
  }
}
