import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { DataService } from './services/data.service';
import { BoardModel } from './models/board.model';
import { Store } from '@ngrx/store';
import { boardsActions } from './state/boards.actions';

@Component({
  selector: 'app-root',
  template: `
    <app-control-panel></app-control-panel>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  title = 'Boards';

  constructor(
    private readonly dataService: DataService,
    private readonly store: Store,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.dataService
      .getExampleBoards$()
      .pipe(take(1))
      .subscribe({
        next: (boards: BoardModel[]) => {
          this.store.dispatch(boardsActions.setBoardList({ payload: boards }));
        },
        error: (err) => {
          console.error(err);
          this.store.dispatch(boardsActions.setBoardList({ payload: [] }));
        },
      });
  }
}
