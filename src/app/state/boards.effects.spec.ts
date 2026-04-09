import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { TestScheduler } from 'rxjs/testing';

import { BoardsEffects } from './boards.effects';
import { boardsActions } from './boards.actions';
import { BOARDS_APP_KEY, LocalStorageService } from '../services/local-storage.service';
import { DataService } from '../services/data.service';

describe('BoardsEffects', () => {
  let actions$: Observable<Action>;
  let effects: BoardsEffects;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'createBoard',
      'renameBoard',
      'removeBoard',
      'updateBoard',
      'getKey',
      'setKey',
    ]);
    dataServiceSpy = jasmine.createSpyObj('DataService', ['getExampleBoards$']);

    TestBed.configureTestingModule({
      providers: [
        BoardsEffects,
        provideMockActions(() => actions$),
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
      ],
    });

    effects = TestBed.inject(BoardsEffects);

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('CreateBoard$', () => {
    it('should call localStorageService.createBoard and dispatch createBoardSuccess', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const payload = 'New Board';
        const action = boardsActions.createBoard({ payload });
        const completion = boardsActions.createBoardSuccess({ payload });

        actions$ = hot('-a', { a: action });

        expectObservable(effects.CreateBoard$).toBe('-b', { b: completion });
      });

      expect(localStorageServiceSpy.createBoard).toHaveBeenCalledWith('New Board');
    });

    it('should work with a simple Observable', (done) => {
      const payload = 'Another Board';
      actions$ = of(boardsActions.createBoard({ payload }));

      effects.CreateBoard$.subscribe((dispatched) => {
        expect(dispatched).toEqual(boardsActions.createBoardSuccess({ payload }));
        expect(localStorageServiceSpy.createBoard).toHaveBeenCalledWith(payload);
        done();
      });
    });
  });

  describe('RenameBoard$', () => {
    it('should call localStorageService.renameBoard and dispatch renameBoardSuccess', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const id = 'board-1';
        const title = 'Renamed';
        actions$ = hot('-a', { a: boardsActions.renameBoard({ id, title }) });

        expectObservable(effects.RenameBoard$).toBe('-b', {
          b: boardsActions.renameBoardSuccess({ id, title }),
        });
      });

      expect(localStorageServiceSpy.renameBoard).toHaveBeenCalledWith('board-1', 'Renamed');
    });
  });

  describe('RemoveBoard$', () => {
    it('should call localStorageService.removeBoard and dispatch removeBoardSuccess', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const payload = 'board-1';
        actions$ = hot('-a', { a: boardsActions.removeBoard({ payload }) });

        expectObservable(effects.RemoveBoard$).toBe('-b', {
          b: boardsActions.removeBoardSuccess({ payload }),
        });
      });

      expect(localStorageServiceSpy.removeBoard).toHaveBeenCalledWith('board-1');
    });
  });

  describe('UpdateBoard$', () => {
    it('should call localStorageService.updateBoard and dispatch updateBoardSuccess', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const payload = { id: 'board-1', title: 'Board', lists: [] } as any;
        actions$ = hot('-a', { a: boardsActions.updateBoard({ payload }) });

        expectObservable(effects.UpdateBoard$).toBe('-b', {
          b: boardsActions.updateBoardSuccess({ payload }),
        });
      });

      expect(localStorageServiceSpy.updateBoard).toHaveBeenCalled();
    });
  });

  describe('DownloadBoards$', () => {
    it('should return boards from local storage when present', (done) => {
      const stored = [{ id: 'b1', title: 'Stored', lists: [] }] as any;
      const fetched = [{ id: 'b2', title: 'Fetched', lists: [] }] as any;

      localStorageServiceSpy.getKey.and.returnValue(stored);
      dataServiceSpy.getExampleBoards$.and.returnValue(of(fetched));
      actions$ = of(boardsActions.getBoardList());

      effects.DownloadBoards$.subscribe((dispatched) => {
        expect(dispatched).toEqual(boardsActions.getBoardListSuccess({ payload: stored }));
        expect(localStorageServiceSpy.setKey).not.toHaveBeenCalled();
        done();
      });
    });

    it('should persist and dispatch fetched boards when storage is empty', (done) => {
      const fetched = [{ id: 'b2', title: 'Fetched', lists: [] }] as any;

      localStorageServiceSpy.getKey.and.returnValue(null);
      dataServiceSpy.getExampleBoards$.and.returnValue(of(fetched));
      actions$ = of(boardsActions.getBoardList());

      effects.DownloadBoards$.subscribe((dispatched) => {
        expect(dispatched).toEqual(boardsActions.getBoardListSuccess({ payload: fetched }));
        expect(localStorageServiceSpy.setKey).toHaveBeenCalledWith(BOARDS_APP_KEY, fetched);
        done();
      });
    });

    it('should dispatch success with empty payload on error', (done) => {
      dataServiceSpy.getExampleBoards$.and.returnValue(throwError(() => new Error('boom')));
      actions$ = of(boardsActions.getBoardList());

      effects.DownloadBoards$.subscribe((dispatched) => {
        expect(dispatched).toEqual(boardsActions.getBoardListSuccess({ payload: [] }));
        done();
      });
    });
  });
});
