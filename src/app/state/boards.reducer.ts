import { Action, createReducer, on } from '@ngrx/store';

import { IBoard } from '../models/interfaces/board.interface';
import { boardsActions } from './boards.actions';
import { BoardModel } from '../models/board.model';

export interface IState {
  boardList: IBoard[];
  selectedBoard: IBoard | null;
  loading: {
    list: boolean;
    board: boolean;
  };
}

export const initialState: IState = {
  boardList: [],
  selectedBoard: null,
  loading: {
    list: false,
    board: false,
  },
};

const _reducer = createReducer(
    initialState,
    on(boardsActions.getBoardListSuccess, (state: IState, { payload }) => {
      return {
        ...state,
        boardList: payload,
        loading: {
          ...state.loading,
          list: false,
        },
      };
    }),
    on(boardsActions.selectBoard, (state, { payload }) => {
      return {
        ...state,
        selectedBoard: payload,
        loading: {
          ...state.loading,
          board: false,
        },
      };
    }),
    on(boardsActions.createBoardSuccess, (state, { payload }) => {
      return {
        ...state,
        boardList: [...state.boardList, new BoardModel(payload, 'New board')],
        loading: {
          ...state.loading,
          board: false,
        },
      };
    }),
    on(boardsActions.renameBoardSuccess, (state, { id, title }) => {
      return {
        ...state,
        boardList: [...state.boardList.map(board => {
          if (board.id === id) {
            return {
              ...board,
              title
            };
          }

          return board;
        })],
      };
    }),
    on(boardsActions.removeBoardSuccess, (state, { payload }) => {
      return {
        ...state,
        boardList:
          state.boardList.filter(({ id: boardId }) => payload !== boardId) ?? [],
        loading: {
          ...state.loading,
          board: false,
        },
      };
    }),
    on(boardsActions.updateBoardSuccess, (state, { payload }) => {
      return {
        ...state,
        boardList: [
          ...state.boardList.filter(({ id: boardId }) => payload.id !== boardId) ?? [],
            payload
        ],
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
