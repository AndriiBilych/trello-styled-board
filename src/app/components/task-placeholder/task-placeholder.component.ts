import { Component, Input } from '@angular/core';

import { ITask } from '../../models/interfaces/task.interface';

@Component({
  selector: 'app-task-placeholder',
  template: `
    @if (task) {
      <div class="relative">
        <div class="mt-2 mx-3.5 rounded">
          <div
            class="flex justify-between rounded break-words h-auto p-1 pr-2 dark:text-white dark:bg-gray-400 dark:border-gray-400 bg-blue-100
           border-blue-100 border-2"
          >
            <div class="pl-2.5">{{ task.content }}</div>
          </div>
        </div>
        <div
          [class.hidden]="!hidden"
          class="absolute top-0 left-0 h-full w-full dark:bg-gray-600 bg-gray-100 rounded-l"
        ></div>
      </div>
    }
  `,
})
export class TaskPlaceholderComponent {
  @Input() task: ITask;
  @Input() hidden = false;
}
