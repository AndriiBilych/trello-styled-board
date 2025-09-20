import { Component, Input } from '@angular/core';
import { IList } from '../../models/interfaces/list.interface';

@Component({
  selector: 'app-list-placeholder',
  template: `
    @if (list) {
      <div class="relative">
        <div
          class="mx-1.5 dark:text-white dark:bg-gray-600 bg-gray-100 rounded-t-xl group"
        >
          <div class="flex justify-between px-5 py-2.5">
            <div class="title ellipsis-box-1" [title]="list.title">
              {{ list.title }}
            </div>
          </div>
        </div>

        <div
          class="list dark:text-white dark:bg-gray-600 bg-gray-100 my-0 mx-1.5 overflow-y-auto"
        >
          <app-task
            *ngFor="let task of list.tasks; index as i"
            [task]="task"
          ></app-task>
        </div>

        <div
          class="dark:text-white dark:bg-gray-600 bg-gray-100 px-4 py-0 mx-1.5 my-0 rounded-b-xl"
        >
          <div class="mb-2 py-2.5 px-1.5">
            <button class="border-none">
              + {{ 'list.addAnotherTask' | translate }}
            </button>
          </div>
        </div>
        <div
          [class.hidden]="!hidden"
          class="list-placeholder absolute top-0 left-0 h-full ml-1.5 dark:text-white dark:bg-gray-600 bg-gray-100 rounded-xl"
        ></div>
      </div>
    }
  `,
  styles: [
    `
      .list {
        max-height: calc(75vh + 5px);
      }

      .list-placeholder {
        width: calc(100% - 0.85rem);
      }
    `,
  ],
})
export class ListPlaceholderComponent {
  @Input() list: IList;
  @Input() hidden = false;
}
