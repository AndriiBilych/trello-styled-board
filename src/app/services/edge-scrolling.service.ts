import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { EEvenType } from '../enums/even-type.enum';
import { CalculationService } from './calculation.service';
import { isWindowScrolledToRight } from '../tools/scrolling.tools';

@Injectable({
  providedIn: 'root',
})
export class EdgeScrollingService {
  // Controls the start of scrolling when dragging to screen edge
  #allowScrolling = true;
  #scrollingInterval: number;
  #scrollSpeed = 30;

  #document: Document = inject(DOCUMENT);
  #calculationService = inject(CalculationService);

  public initMouseMoveListener(signal: AbortSignal): void {
    this.#document.addEventListener(
      EEvenType.mousemove,
      (event: MouseEvent) => this.listMouseMove(event),
      { signal },
    );
  }

  private listMouseMove(event: MouseEvent): void {
    // Controls the scrolling when dragging to the screen edges
    const scrollAtStart = window.scrollX <= 0;
    const scrollAtEnd = isWindowScrolledToRight();

    if (!scrollAtStart) {
      this.initLeftEdge(event);
    }

    if (!scrollAtEnd) {
      this.initRightEdge(event);
    }
  }

  private initLeftEdge(event: MouseEvent) {
    if (event.clientX < 200 && this.#allowScrolling) {
      this.#allowScrolling = false;
      this.#scrollingInterval = setInterval(() => {
        if (window.scrollX <= 0) {
          this.clear();
        }
        window.scrollBy({ left: -this.#scrollSpeed });
        this.#calculationService.adjustBoundingInfoByScrollDelta(
          -this.#scrollSpeed,
        );
      }, 50) as unknown as number;
    }

    if (
      event.clientX > 200 &&
      event.clientX < window.innerWidth - 200 &&
      !this.#allowScrolling
    ) {
      clearInterval(this.#scrollingInterval);
      this.#allowScrolling = true;
    }
  }

  private initRightEdge(event: MouseEvent) {
    if (event.clientX > window.innerWidth - 200 && this.#allowScrolling) {
      this.#allowScrolling = false;
      this.#scrollingInterval = setInterval(() => {
        if (isWindowScrolledToRight()) {
          this.clear();
        }
        window.scrollBy({ left: this.#scrollSpeed });
        this.#calculationService.adjustBoundingInfoByScrollDelta(
          this.#scrollSpeed,
        );
      }, 50) as unknown as number;
    }

    if (
      event.clientX < window.innerWidth - 200 &&
      event.clientX > 200 &&
      !this.#allowScrolling
    ) {
      clearInterval(this.#scrollingInterval);
      this.#allowScrolling = true;
    }
  }

  public clear(): void {
    clearInterval(this.#scrollingInterval);
  }
}
