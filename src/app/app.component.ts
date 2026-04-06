import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    private readonly store: Store,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.store.dispatch(boardsActions.getBoardList());
  }
}
