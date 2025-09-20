import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { BoardModel } from '../../models/board.model';
import { CalculationService } from '../../services/calculation.service';
import { ITask } from '../../models/interfaces/task.interface';
import { IList } from '../../models/interfaces/list.interface';
import { TaskDraggingService } from '../../services/task-dragging.service';

@Component({
  selector: 'app-task',
  template: `
    @if (task) {
      <div class="relative" #TaskContainer>
        <div class="pt-2 px-3.5 rounded cursor-pointer">
          <div
            #TitleRef
            class="flex justify-between rounded break-words dark:bg-gray-400 dark:text-white bg-blue-100 h-auto p-1 group
               border-2 dark:border-gray-400 border-blue-100 hover:border-black"
            [id]="task.id"
          >
            @if (!isChangingTask) {
              <div class="pl-2.5" [title]="task.content">
                {{ task.content }}
              </div>
              <button
                (mousedown)="removeTaskAction.emit(); $event.stopPropagation()"
                class="remove-task-button hidden border-none mb-auto"
              >
                &times;
              </button>
            } @else {
              <app-input-form
                (textSubmissionAction)="toggle($event)"
                [textToShow]="task.content"
              ></app-input-form>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .group:hover .remove-task-button {
        display: block;
      }
    `,
  ],
})
export class TaskComponent implements AfterViewInit, OnDestroy {
  isChangingTask = false;

  @Input() task: ITask;
  @Input() list: IList;
  @Input() selectedBoard: BoardModel | null = null;
  @Input() initListener = false;
  @Input() taskAtMousePosition!: HTMLElement;

  @Output() removeTaskAction = new EventEmitter();

  @ViewChild('TitleRef') titleRef: ElementRef;
  @ViewChild('TaskContainer') taskContainer: ElementRef;

  #taskDraggingService = inject(TaskDraggingService);
  #calculationService = inject(CalculationService);

  ngAfterViewInit(): void {
    if (!this.titleRef?.nativeElement) {
      throw new Error('Task ref not found');
    }

    if (this.initListener && this.selectedBoard && this.taskAtMousePosition) {
      this.#taskDraggingService.initTaskMouseDownListener(
        this.titleRef.nativeElement,
        this.selectedBoard,
        this.taskAtMousePosition,
        () => this.onClick(),
      );
    }
  }

  ngOnDestroy(): void {
    if (this.initListener) {
      this.titleRef.nativeElement.removeAllListeners();
    }
  }

  onClick(): void {
    this.isChangingTask = !this.isChangingTask;
  }

  calculateBoundingInfo(): void {
    if (this.taskContainer?.nativeElement && this.task?.id) {
      this.#calculationService.calculateTaskBoundingInfo(
        this.taskContainer.nativeElement,
        this.task.id,
        this.list.id,
      );
    }
  }

  toggle(event: { text: string; keep: boolean }): void {
    this.isChangingTask = !this.isChangingTask;
    this.task.content = event.text.length > 0 ? event.text : this.task.content;
  }
}
