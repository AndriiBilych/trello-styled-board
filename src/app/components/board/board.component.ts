import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  viewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { BoardModel } from '../../models/board.model';
import { ListModel } from '../../models/list.model';
import { BoardStoreService } from '../../services/board-store.service';
import { TaskModel } from '../../models/task.model';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { ReactiveComponent } from '../../tools/reactive';
import { RoutingService } from '../../services/routing.service';
import { CalculationService } from '../../services/calculation.service';
import { ListDraggingService } from '../../services/list-dragging.service';
import { ListComponent } from '../list/list.component';
import { makeId } from '../../tools/make-id.tool';
import { TaskDraggingService } from '../../services/task-dragging.service';
import { TaskComponent } from '../task/task.component';
import { BoardDraggingService } from '../../services/board-dragging.service';
import { onInterval } from '../../tools/interval.tool';
import { Store } from '@ngrx/store';
import { selectSelectedBoard } from '../../state/boards.selectors';
import { boardsActions } from '../../state/boards.actions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .board {
        height: calc(100vh - 3.5rem);
      }
    `,
  ],
})
export class BoardComponent
  extends ReactiveComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  selectedBoard: BoardModel;
  selectedTaskData: TaskModel;
  currentIndex: number;

  isAddingList = false;
  isDraggingTask = false;
  @ViewChild('FakeTask') fakeTask: ElementRef;
  @ViewChild('board') boardRef: ElementRef;
  @ViewChild('ListAtMousePosition') listAtMousePosition: ElementRef;
  @ViewChild('TaskAtMousePosition') taskAtMousePosition: ElementRef;

  mouseStartingX: number;
  #scrollLeft = 0;
  #checkForScrollbarDrag = false;

  lists = viewChildren(ListComponent);
  tasks = viewChildren(TaskComponent);

  listDraggingService = inject(ListDraggingService);
  taskDraggingService = inject(TaskDraggingService);
  #calculationService = inject(CalculationService);
  #boardDraggingService = inject(BoardDraggingService);

  constructor(
    private readonly boardStoreService: BoardStoreService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly routingService: RoutingService,
    private readonly store: Store,
  ) {
    super();
    this.mouseStartingX = null;
    this.selectedBoard = null;
    this.currentIndex = null;

    this.store.select(selectSelectedBoard).subscribe((board: BoardModel) => {
      if (isNotNullOrUndefined(board)) {
        this.selectedBoard = board;
        this.initBoundingInfo();
      }
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.params,
      this.boardStoreService.boards$.pipe(
        filter(isNotNullOrUndefined),
        map((boards: BoardModel[] | null) =>
          boards.map((board) => ({
            ...board,
            lists: board.lists.map((list: ListModel) => ({
              ...list,
              id: 'list' + list.id,
              tasks: list.tasks.map((task: TaskModel) => ({
                ...task,
                id: `task${task.id}`,
              })),
            })),
          })),
        ),
      ),
    ])
      .pipe(this.takeUntil())
      .subscribe(([{ id }, boards]) => {
        const board = boards.find(({ id: boardId }) => boardId === id);
        if (board === undefined) {
          this.routingService.routeToNotFound();
        }
        this.store.dispatch(boardsActions.setBoard({ payload: board }));
      });

    this.listDraggingService.onMoved$
      .pipe(this.takeUntil())
      .subscribe(() => this.initBoundingInfo());
    this.taskDraggingService.onMoved$
      .pipe(this.takeUntil())
      .subscribe(() => this.initBoundingInfo());
  }

  ngAfterViewInit(): void {
    onInterval(
      () => this.boardRef?.nativeElement,
      () =>
        this.#boardDraggingService.initBoardMouseDownListener(
          this.boardRef.nativeElement,
        ),
      50,
    );
  }

  initBoundingInfo() {
    if (this.selectedBoard.lists.length > 0) {
      const taskCount = this.selectedBoard.lists.reduce(
        (res, current) => res + current.tasks.length,
        0,
      );
      onInterval(
        () =>
          this.lists().length === this.selectedBoard.lists.length &&
          this.tasks().length === taskCount,
        () => this.calculateBoundingInfoForAll(),
        50,
      );
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(boardsActions.setBoard({ payload: null }));
  }

  @HostListener('document:wheel', ['$event'])
  onWheel(event: any): void {
    const target = event?.target;

    if (target && target.isEqualNode(this.boardRef.nativeElement)) {
      this.calculateBoundingInfoForAll();
      if (!event.shiftKey) {
        window.scrollBy({ left: event.deltaY });
      }
    }
  }

  @HostListener('document:mousedown')
  onMousedown(): void {
    this.#scrollLeft = window.scrollX;
    this.#checkForScrollbarDrag = true;
  }

  @HostListener('document:mouseup')
  onMouseup(): void {
    if (this.#checkForScrollbarDrag && window.scrollX !== this.#scrollLeft) {
      this.calculateBoundingInfoForAll();
      this.#checkForScrollbarDrag = false;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.calculateBoundingInfoForAll();
  }

  calculateBoundingInfoForAll(): void {
    this.#calculationService.boundingInfo.clear();
    this.lists().forEach((list: ListComponent) => list.calculateBoundingInfo());
    this.tasks().forEach((task: TaskComponent) => task.calculateBoundingInfo());
  }

  removeList(index: number): void {
    const length = this.lists().length;
    this.selectedBoard.lists.splice(index, 1);
    const interval = setInterval(() => {
      if (this.lists().length === length - 1) {
        this.calculateBoundingInfoForAll();
        clearInterval(interval);
      }
    }, 50);
  }

  removeTask(listIndex: number, taskIndex: number): void {
    const length = this.tasks().length;
    this.selectedBoard.lists[listIndex].tasks.splice(taskIndex, 1);
    const interval = setInterval(() => {
      if (this.tasks().length === length - 1) {
        this.calculateBoundingInfoForAll();
        clearInterval(interval);
      }
    }, 50);
  }

  onTextSubmissionAction(event: { text: string; keep: boolean }) {
    this.isAddingList = !this.isAddingList;
    if (event?.text?.length) {
      const newId = this.generateNewListId();
      this.selectedBoard.lists.push(new ListModel(event.text, newId));
      this.isAddingList = event.keep;
    }
  }

  private generateNewListId(): string {
    let isPresent = false;
    let newId = '';
    do {
      newId = makeId(4);
      isPresent =
        this.selectedBoard.lists.findIndex(({ id }) => id === newId) !== -1;
    } while (isPresent);

    return newId;
  }
}
