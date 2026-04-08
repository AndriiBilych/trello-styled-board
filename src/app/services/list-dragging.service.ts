import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { EEvenType } from '../enums/even-type.enum';
import { BoardModel } from '../models/board.model';
import { getIdFromAttribute } from '../tools/html-element.tools';
import { ListModel } from '../models/list.model';
import { IList } from '../models/interfaces/list.interface';
import { CalculationService } from './calculation.service';
import { EdgeScrollingService } from './edge-scrolling.service';

@Injectable({
  providedIn: 'root',
})
export class ListDraggingService {
  readonly #onMoved = new Subject<boolean>();
  public onMoved$ = this.#onMoved.asObservable();

  // The element being dragged
  sourceListIndex: number | null = null;
  // The new position of the dragged element
  targetListIndex: number | null = null;
  // The data spliced from the board data
  sourceListData: ListModel | null = null;
  // sourceListData can't be used because placeholder needs to appear before sourceListData is spliced from the board
  sourceListPlaceholderData: IList | null = null;

  #document: Document = inject(DOCUMENT);
  #calculationService = inject(CalculationService);
  #edgeScrollingService = inject(EdgeScrollingService);
  shouldInsert = false;

  public initListMouseDownListener(
    element: HTMLElement,
    getBoard: () => BoardModel,
    listAtMousePosition: HTMLElement,
    clickCallback: (e: MouseEvent) => void,
  ): void {
    element.addEventListener(EEvenType.mousedown, () =>
      this.listMouseDown(
        element,
        getBoard,
        listAtMousePosition,
        clickCallback,
      ),
    );
  }

  private listMouseDown(
    element: HTMLElement,
    getBoard: () => BoardModel,
    listAtMousePosition: HTMLElement,
    clickCallback: (e: MouseEvent) => void,
  ): void {
    // console.log('[list mouse down]');
    const board = getBoard();
    const listId = getIdFromAttribute(element);
    this.sourceListIndex = board.lists.findIndex(
      ({ id }) => id === listId,
    );
    this.sourceListPlaceholderData = {
      ...board.lists[this.sourceListIndex],
    };
    this.targetListIndex = this.sourceListIndex;
    this.sourceListData = board.lists[this.sourceListIndex];

    const controller = new AbortController();
    const { signal } = controller;
    this.#document.addEventListener(
      EEvenType.mousemove,
      this.listMouseMove.bind(this, getBoard, listAtMousePosition),
      { signal },
    );
    this.#document.addEventListener(
      EEvenType.mouseup,
      this.listMouseUp.bind(
        this,
        controller,
        getBoard,
        listAtMousePosition,
        clickCallback,
      ),
      { signal },
    );
    this.#edgeScrollingService.initMouseMoveListener(signal);
  }

  private listMouseMove(
    getBoard: () => BoardModel,
    listAtMousePosition: HTMLElement,
    event: MouseEvent,
  ): void {
    // console.log('[list mouse move]', );
    this.targetListIndex = this.#calculationService.findListIndexByMouseX(
      event.clientX,
    );
    if (!this.shouldInsert) {
      this.sourceListData = getBoard().lists.splice(
        this.sourceListIndex,
        1,
      )[0];
      this.shouldInsert = true;
    } else {
      listAtMousePosition.style.left = `${event.clientX}px`;
      listAtMousePosition.style.top = `${event.clientY}px`;
    }
  }

  private listMouseUp(
    controller: AbortController,
    getBoard: () => BoardModel,
    listAtMousePosition: HTMLElement,
    clickCallback: (e: MouseEvent) => void,
    event: MouseEvent,
  ): void {
    // console.log('[list mouse up]', this.shouldInsert);
    controller.abort();
    if (this.shouldInsert) {
      getBoard().lists.splice(this.targetListIndex, 0, this.sourceListData);
      this.#onMoved.next(true);
      this.shouldInsert = false;
    } else {
      clickCallback(event);
    }
    this.sourceListData = null;
    this.resetDraggingListStatus(listAtMousePosition);
    this.#edgeScrollingService.clear();
  }

  private resetDraggingListStatus(listAtMousePosition: HTMLElement): void {
    this.sourceListIndex = null;
    this.targetListIndex = null;
    this.sourceListPlaceholderData = null;
    listAtMousePosition.style.removeProperty('top');
    listAtMousePosition.style.removeProperty('left');
  }
}
