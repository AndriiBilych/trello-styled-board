import { Component } from '@angular/core';
import { RoutingService } from '../../services/routing.service';
import { Store } from '@ngrx/store';
import { boardsActions } from '../../state/boards.actions';
import { selectBoardList } from '../../state/boards.selectors';
import { newBoardId } from '../../tools/make-id.tool';
import { IBoard } from '../../models/interfaces/board.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-homepage-list-button',
  template: `
    <li
      class="px-4 py-6 grid grid-cols-2 sm:grid-cols-5 sm:gap-4 sm:px-0 h-32 rounded-lg dark:hover:bg-gray-600 hover:bg-blue-100 group transition
       cursor-pointer"
      (click)="createBoard()"
    >
      <span
        class="flex justify-center items-center font-medium text-lg leading-6 sm:col-span-2 dark:group-hover:text-white
        group-hover:text-gray-500 dark:text-white dark:bg-gray-600 text-gray-900 bg-blue-100 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 mr-1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        {{ 'addBoard.title' | translate }}
      </span>
      <span class="flex justify-center items-center sm:col-span-3">
        <span
          class="mt-1 text-sm leading-6 dark:text-gray-300 text-gray-700 ellipsis-box-3"
        >
          {{ 'addBoard.description' | translate }}
        </span>
      </span>
    </li>
  `,
})
export class HomepageListButtonComponent {
  constructor(
    public readonly routingService: RoutingService,
    public readonly store: Store,
  ) {}

  createBoard(): void {
    this.store
      .select(selectBoardList)
      .pipe(take(1))
      .subscribe((boards: IBoard[]) => {
        const id = newBoardId(boards).toString();
        this.store.dispatch(boardsActions.createBoard({ payload: id }));
        this.routingService.routeToEditBoard(id);
      });
  }
}
