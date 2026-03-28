import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BoardModel } from '../models/board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardStoreService {
  #boardsSource = new BehaviorSubject<BoardModel[] | null>(null);
  boards$ = this.#boardsSource.asObservable();

  selectedBoard = signal<BoardModel | null>(null);

  setBoards(data: BoardModel[]) {
    this.#boardsSource.next(data);
  }

  createBoard(): string {
    const id = this.newBoardId().toString();
    this.setBoards([
      ...(this.#boardsSource?.value ?? []),
      new BoardModel(id, 'New board'),
    ]);
    return id;
  }

  removeBoard(id: string): string {
    this.setBoards([
      ...(this.#boardsSource?.value?.filter(
        ({ id: boardId }) => id !== boardId,
      ) ?? []),
    ]);
    return id;
  }

  private newBoardId(): number {
    if (!this.#boardsSource.value?.length) {
      return 0;
    }

    return (
      Number(
        this.#boardsSource.value?.reduce((prev, curr) =>
          prev.id > curr.id ? prev : curr,
        ).id,
      ) + 1
    );
  }
}
