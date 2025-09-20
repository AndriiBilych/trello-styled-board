import { Action, createReducer, on } from '@ngrx/store';

import { IBoard } from '../models/interfaces/board.interface';
import * as actions from './actions';

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
  on(actions.actions.setList, (state, { payload }) => {
    return {
      ...state,
      list: payload,
      loading: {
        ...state.loading,
        list: false,
      },
    };
  }),
  on(actions.actions.setBoard, (state, { payload }) => {
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

export function reducer(state: IState = initialState, action: Action): IState {
  return _reducer(state, action);
}
