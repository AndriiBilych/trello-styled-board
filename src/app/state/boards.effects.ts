import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {BOARDS_APP_KEY, LocalStorageService} from '../services/local-storage.service';
import {boardsActions} from './boards.actions';
import {DataService} from '../services/data.service';
import {of} from 'rxjs';

@Injectable()
export class BoardsEffects {

    DownloadBoards$  =
        createEffect(() =>
            this.actions$.pipe(
                ofType(boardsActions.getBoardList),
                exhaustMap(() =>
                    this.dataService.getExampleBoards$().pipe(
                        map((list) => {
                            const boardsPresent = this.localStorageService.getKey(BOARDS_APP_KEY);
                            if (boardsPresent) {
                                return boardsActions.getBoardListSuccess({payload: boardsPresent});
                            }

                            this.localStorageService.setKey(BOARDS_APP_KEY, list);
                            return boardsActions.getBoardListSuccess({payload: list});
                        }),
                        catchError((err) =>
                            of(boardsActions.getBoardListSuccess({ payload: [] }))
                        )
                    )
                )
            )
        );

    CreateBoard$  =
        createEffect(() =>
            this.actions$.pipe(
                ofType(boardsActions.createBoard),
                map(({payload}) => {
                    this.localStorageService.createBoard(payload);
                    return boardsActions.createBoardSuccess({payload});
                })
            )
        );

    RenameBoard$  =
        createEffect(() =>
            this.actions$.pipe(
                ofType(boardsActions.renameBoard),
                map(({id, title}) => {
                    this.localStorageService.renameBoard(id, title);
                    return boardsActions.renameBoardSuccess({id, title});
                })
            )
        );

    RemoveBoard$  =
        createEffect(() =>
            this.actions$.pipe(
                ofType(boardsActions.removeBoard),
                map(({payload}) => {
                    this.localStorageService.removeBoard(payload);
                    return boardsActions.removeBoardSuccess({payload});
                })
            )
        );

    UpdateBoard$  =
        createEffect(() =>
            this.actions$.pipe(
                ofType(boardsActions.updateBoard),
                map(({payload}) => {
                    this.localStorageService.updateBoard(payload);
                    return boardsActions.updateBoardSuccess({payload});
                })
            )
        );

    constructor(
        private actions$: Actions,
        private localStorageService: LocalStorageService,
        private dataService: DataService
    ) {}
}
