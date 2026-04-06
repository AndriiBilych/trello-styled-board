import { Injectable } from '@angular/core';
import {IBoard} from '../models/interfaces/board.interface';
import {BoardModel} from '../models/board.model';

export const BOARDS_APP_KEY = 'BOARDS_APP_KEY_VERY_COOL_VERY_NICE';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setKey(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getKey(key: string): any | null {
    const  value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    }

    return null;
  }

  createBoard(id: string): void {
    let boards: IBoard[] = this.getKey(BOARDS_APP_KEY);

    boards = [...boards, new BoardModel(id, 'New board')];

    this.setKey(BOARDS_APP_KEY, boards);
  }

  renameBoard(id: string, title: string): void {
    let boards: IBoard[] = this.getKey(BOARDS_APP_KEY);

    boards = [...boards.map(board => {
      if (board.id === id) {
        return {
          ...board,
          title
        };
      }

      return board;
    })];

    this.setKey(BOARDS_APP_KEY, boards);
  }

  removeBoard(id: string): void {
    let boards: IBoard[] = this.getKey(BOARDS_APP_KEY);

    boards = boards.filter(({ id: boardId }) => id !== boardId) ?? [];

    this.setKey(BOARDS_APP_KEY, boards);
  }

  updateBoard(board: IBoard): void {
    let boards: IBoard[] = this.getKey(BOARDS_APP_KEY);

    boards = [
      ...boards.filter(({ id: boardId }) => board.id !== boardId),
      board
    ];

    this.setKey(BOARDS_APP_KEY, boards);
  }
}
