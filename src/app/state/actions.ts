import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { IBoard } from '../models/interfaces/board.interface';

export enum ActionTypes {
  getList = 'Get List',
  setList = 'Set List',
  getBoard = 'Get Board',
  setBoard = 'Set Board',
  updateBoard = 'Update Board',
}

export const actions = createActionGroup({
  source: 'Actions',
  events: {
    [ActionTypes.getList]: emptyProps(),
    [ActionTypes.setList]: props<{ payload: IBoard[] }>(),
    [ActionTypes.getBoard]: props<{ payload: string }>(),
    [ActionTypes.setBoard]: props<{ payload: IBoard }>(),
    [ActionTypes.updateBoard]: props<{ payload: IBoard }>(),
  },
});
