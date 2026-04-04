import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { IBoard } from '../models/interfaces/board.interface';

export enum ActionTypes {
  getBoardList = 'Get Board List',
  setBoardList = 'Set Board List',
  getBoard = 'Get Board',
  setBoard = 'Set Board',
  createBoard = 'Create Board',
  renameBoard = 'Rename Board',
  removeBoard = 'Remove Board',
  updateBoard = 'Update Board',
  setBoardsToLocalStorage = 'Set Boards To Local Storage',
}

export const boardsActions = createActionGroup({
  source: 'Actions',
  events: {
    [ActionTypes.getBoardList]: emptyProps(),
    [ActionTypes.setBoardList]: props<{ payload: IBoard[] }>(),
    [ActionTypes.getBoard]: props<{ payload: string }>(),
    [ActionTypes.setBoard]: props<{ payload: IBoard }>(),
    [ActionTypes.createBoard]: props<{ payload: string }>(),
    [ActionTypes.renameBoard]: props<{ id: string, title: string }>(),
    [ActionTypes.removeBoard]: props<{ payload: string }>(),
    [ActionTypes.updateBoard]: props<{ payload: IBoard }>(),
    [ActionTypes.setBoardsToLocalStorage]: props<{ payload: IBoard[] }>(),
  },
});
