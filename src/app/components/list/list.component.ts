import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';

import { TaskModel } from '../../models/task.model';
import { IList } from '../../models/interfaces/list.interface';
import { ListDraggingService } from '../../services/list-dragging.service';
import { BoardModel } from '../../models/board.model';
import { CalculationService } from '../../services/calculation.service';
import { makeId } from '../../tools/make-id.tool';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [
    `
      .list {
        max-height: calc(75vh + 5px);
      }

      .group:hover .remove-list-button {
        display: block;
      }
    `,
  ],
})
export class ListComponent implements AfterViewInit, OnDestroy {
  isAddingTask: boolean;
  isChangingName: boolean;

  @Input() list: IList;
  @Input() selectedBoard: BoardModel | null = null;
  @Input() listAtMousePosition!: HTMLElement;
  @Input() hidden = false;
  @Input() initListener = false;

  @Output() removeListAction = new EventEmitter();
  @Output() updateList = new EventEmitter<IList>();

  @ViewChild('TitleRef') titleRef: ElementRef;
  @ViewChild('ListContainer') listContainer: ElementRef;

  #listDraggingService = inject(ListDraggingService);
  #calculationService = inject(CalculationService);

  constructor() {
    this.isAddingTask = false;
    this.isChangingName = false;
  }

  ngAfterViewInit(): void {
    if (!this.titleRef?.nativeElement) {
      throw new Error('List ref not found');
    }

    if (this.initListener && this.selectedBoard && this.listAtMousePosition) {
      this.#listDraggingService.initListMouseDownListener(
        this.titleRef.nativeElement,
        this.selectedBoard,
        this.listAtMousePosition,
        () => this.onClick(),
      );
    }
  }

  ngOnDestroy(): void {
    if (this.initListener) {
      this.titleRef?.nativeElement.removeAllListeners();
    }
  }

  calculateBoundingInfo(): void {
    if (this.listContainer?.nativeElement && this.list?.id) {
      this.#calculationService.calculateListBoundingInfo(
        this.listContainer.nativeElement,
        this.list.id,
      );
    }
  }

  onClick(): void {
    this.isChangingName = !this.isChangingName;
  }

  onTextSubmissionAction(event: { text: string; keep: boolean }): void {
    this.isAddingTask = !this.isAddingTask;
    if (event?.text?.length) {
      const newId = this.generateNewTaskId();
      this.list.tasks.push(new TaskModel(event.text, newId));
      this.isAddingTask = event.keep;
    }
  }

  renameList(title: { text: string; keep: boolean }): void {
    this.updateList.emit({
      ...this.list,
      title: title.text.length > 0 ? title.text : this.list.title
    });
  }

  private generateNewTaskId(): string {
    let isPresent = false;
    let newId = '';
    do {
      newId = makeId(4);
      isPresent =
        this.selectedBoard.lists.findIndex(({ tasks }) => {
          return tasks.some(({ id }) => id === newId);
        }) !== -1;
    } while (isPresent);

    return newId;
  }
}
