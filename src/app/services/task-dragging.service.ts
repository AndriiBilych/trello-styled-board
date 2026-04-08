import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

import { EEvenType } from '../enums/even-type.enum';
import { BoardModel } from '../models/board.model';
import { getIdFromAttribute } from '../tools/html-element.tools';
import { CalculationService } from './calculation.service';
import { TaskModel } from '../models/task.model';
import { ITask } from '../models/interfaces/task.interface';
import { EdgeScrollingService } from './edge-scrolling.service';

@Injectable({
  providedIn: 'root',
})
export class TaskDraggingService {
  readonly #onMoved = new Subject<boolean>();
  public onMoved$ = this.#onMoved.asObservable();

  // Index of the task being dragged
  sourceTaskIndex: number | null = null;
  // Index of the list the task is being dragged from
  sourceListIndex: number | null = null;
  // The new task position of the dragged element
  targetTaskIndex: number | null = null;
  // The index of the list to which the task is being dragged to
  targetListIndex: number | null = null;
  // The data spliced from the board data
  sourceTaskData: TaskModel | null = null;
  // sourceTaskData can't be used because placeholder needs to appear before sourceTaskData is spliced from the board
  sourceTaskPlaceholderData: ITask | null = null;

  #document: Document = inject(DOCUMENT);
  #calculationService = inject(CalculationService);
  #edgeScrollingService = inject(EdgeScrollingService);
  shouldInsert = false;

  public initTaskMouseDownListener(
    element: HTMLElement,
    getBoard: () => BoardModel,
    taskAtMousePosition: HTMLElement,
    clickCallback: (e: MouseEvent) => void,
  ): void {
    element.addEventListener(EEvenType.mousedown, () =>
      this.taskMouseDown(
        element,
        getBoard,
        taskAtMousePosition,
        clickCallback,
      ),
    );
  }

  private taskMouseDown(
    element: HTMLElement,
    getBoard: () => BoardModel,
    taskAtMousePosition: HTMLElement,
    clickCallback: (e: MouseEvent) => void,
  ): void {
    // console.log('[task mouse down]');

    const board = getBoard();
    const taskId = getIdFromAttribute(element);
    this.sourceListIndex = board.lists.findIndex(({ tasks }) => {
      this.sourceTaskIndex = tasks.findIndex(({ id }) => taskId === id);
      return this.sourceTaskIndex > -1;
    });
    this.sourceTaskPlaceholderData = {
      ...board.lists[this.sourceListIndex].tasks[this.sourceTaskIndex],
    };
    this.targetTaskIndex = this.sourceTaskIndex;
    this.targetListIndex = this.sourceListIndex;
    this.sourceTaskData =
      board.lists[this.sourceListIndex].tasks[this.sourceTaskIndex];

    const controller = new AbortController();
    const { signal } = controller;
    this.#document.addEventListener(
      EEvenType.mousemove,
      this.taskMouseMove.bind(this, getBoard, taskAtMousePosition),
      { signal },
    );
    this.#document.addEventListener(
      EEvenType.mouseup,
      this.taskMouseUp.bind(
        this,
        controller,
        getBoard,
        taskAtMousePosition,
        clickCallback,
      ),
      { signal },
    );
    this.#edgeScrollingService.initMouseMoveListener(signal);
  }

  private taskMouseMove(
    getBoard: () => BoardModel,
    taskAtMousePosition: HTMLElement,
    event: MouseEvent,
  ): void {
    const board = getBoard();
    this.targetListIndex = this.#calculationService.findListIndexByMouseX(
      event.clientX,
    );
    this.targetTaskIndex = this.#calculationService.findTaskIndexByMouseY(
      board.lists[this.targetListIndex].id,
      event.clientY,
    );
    // console.log('[task mouse move]', this.targetListIndex, this.targetTaskIndex, this.shouldInsert);
    if (!this.shouldInsert) {
      this.sourceTaskData = board.lists[
        this.sourceListIndex
      ].tasks.splice(this.sourceTaskIndex, 1)[0];
      this.shouldInsert = true;
    } else {
      taskAtMousePosition.style.left = `${event.clientX}px`;
      taskAtMousePosition.style.top = `${event.clientY}px`;
    }
  }

  private taskMouseUp(
    controller: AbortController,
    getBoard: () => BoardModel,
    taskAtMousePosition: HTMLElement,
    clickCallback: (e: MouseEvent) => void,
    event: MouseEvent,
  ): void {
    // console.log('[task mouse up]');

    controller.abort();
    if (this.shouldInsert) {
      getBoard().lists[this.targetListIndex].tasks.splice(
        this.targetTaskIndex,
        0,
        this.sourceTaskData,
      );
      this.#onMoved.next(true);
      this.shouldInsert = false;
    } else {
      clickCallback(event);
    }
    this.sourceTaskData = null;
    this.resetDraggingTaskStatus(taskAtMousePosition);
    this.#edgeScrollingService.clear();
  }

  private resetDraggingTaskStatus(taskAtMousePosition: HTMLElement): void {
    this.sourceTaskIndex = null;
    this.sourceListIndex = null;
    this.targetTaskIndex = null;
    this.targetListIndex = null;
    this.sourceTaskPlaceholderData = null;
    taskAtMousePosition.style.removeProperty('top');
    taskAtMousePosition.style.removeProperty('left');
  }
}
