import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { IBoard } from '../models/interfaces/board.interface';

export enum ActionTypes {
  getBoardList = 'Get Board List',
  getBoardListSuccess = 'Get Board List Success',
  selectBoard = 'Select Board',
  createBoard = 'Create Board',
  createBoardSuccess = 'Create Board Success',
  renameBoard = 'Rename Board',
  renameBoardSuccess = 'Rename Board Success',
  removeBoard = 'Remove Board',
  removeBoardSuccess = 'Remove Board Success',
  updateBoard = 'Update Board',
  updateBoardSuccess = 'Update Board Success',
}

export const boardsActions = createActionGroup({
  source: 'Actions',
  events: {
    [ActionTypes.getBoardList]: emptyProps(),
    [ActionTypes.getBoardListSuccess]: props<{ payload: IBoard[] }>(),
    [ActionTypes.selectBoard]: props<{ payload: IBoard }>(),
    [ActionTypes.createBoard]: props<{ payload: string }>(),
    [ActionTypes.createBoardSuccess]: props<{ payload: string }>(),
    [ActionTypes.renameBoard]: props<{ id: string, title: string }>(),
    [ActionTypes.renameBoardSuccess]: props<{ id: string, title: string }>(),
    [ActionTypes.removeBoard]: props<{ payload: string }>(),
    [ActionTypes.removeBoardSuccess]: props<{ payload: string }>(),
    [ActionTypes.updateBoard]: props<{ payload: IBoard }>(),
    [ActionTypes.updateBoardSuccess]: props<{ payload: IBoard }>(),
  },
});
