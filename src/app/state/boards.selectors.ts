import { createSelector } from '@ngrx/store';
import { IState } from './boards.reducer';

export interface AppState {
  boards: IState;
}

export const selectState = (state: AppState) => state.boards;

export const selectSelectedBoard = createSelector(
  selectState,
  (state: IState) => {
    return state.selectedBoard;
  },
);

export const selectBoardList = createSelector(selectState, (state: IState) => {
  return state.boardList;
});
