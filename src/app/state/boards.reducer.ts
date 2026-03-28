import { Action, createReducer, on } from '@ngrx/store';

import { IBoard } from '../models/interfaces/board.interface';
import { boardsActions } from './boards.actions';

export interface IState {
  list: IBoard[];
  selectedBoard: IBoard | null;
  loading: {
    list: boolean;
    board: boolean;
  };
}

export const initialState: IState = {
  list: [],
  selectedBoard: null,
  loading: {
    list: false,
    board: false,
  },
};

const _reducer = createReducer(
  initialState,
  on(boardsActions.setList, (state, { payload }) => {
    return {
      ...state,
      list: payload,
      loading: {
        ...state.loading,
        list: false,
      },
    };
  }),
  on(boardsActions.setBoard, (state, { payload }) => {
    return {
      ...state,
      selectedBoard: payload,
      loading: {
        ...state.loading,
        board: false,
      },
    };
  }),
);

export function boardsReducer(
  state: IState = initialState,
  action: Action,
): IState {
  return _reducer(state, action);
}
