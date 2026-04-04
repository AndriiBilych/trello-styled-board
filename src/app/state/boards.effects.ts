import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap} from 'rxjs/operators';
import {BOARDS_APP_KEY, LocalStorageService} from '../services/local-storage.service';
import {boardsActions} from './boards.actions';

@Injectable()
export class BoardsEffects {

    SetBoardsToLocalStorage$ =
        createEffect(() =>
        this.actions$.pipe(
            ofType(boardsActions.setBoardsToLocalStorage),
            tap(({ payload }) => {
                this.localStorageService.setKey(BOARDS_APP_KEY, payload as any);
            })
        ), { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private localStorageService: LocalStorageService
    ) {}
}
