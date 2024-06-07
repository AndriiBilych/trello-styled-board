import { Component, Input } from '@angular/core';
import { IBoard } from '../../models/interfaces/board.interface';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-homepage-list-item',
  template: `
    <li
      class="px-4 py-6 grid grid-cols-2 sm:grid-cols-5 sm:gap-4 sm:px-0 h-32 rounded-lg hover:bg-blue-100 group transition cursor-pointer"
      (click)="routingService.routeToEditBoard(board.id)">
      <span
        class="flex justify-center items-center sm:col-span-2 bg-blue-100 rounded-lg">
        <span [title]="board.title"
              class="font-medium text-lg leading-6 group-hover:text-gray-500 text-gray-900 ellipsis-box-2 px-4">
          {{ board.title }}
        </span>
      </span>
      <span class="flex justify-center items-center sm:col-span-3">
          <span class="mt-1 text-sm leading-6 text-gray-700 ellipsis-box-3" [title]="board.description">
            <ng-container *ngIf="board?.description?.length; else NoDescription">
              {{ board.description }}
            </ng-container>
            <ng-template #NoDescription>
              No description
            </ng-template>
          </span>
      </span>
    </li>
  `,
})
export class HomepageListItemComponent {
  @Input()
  board: IBoard;

  constructor(
    public readonly routingService: RoutingService
  ) {
  }

}
