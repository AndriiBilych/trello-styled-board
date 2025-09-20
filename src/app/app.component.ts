import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { DataService } from './services/data.service';
import { BoardStoreService } from './services/board-store.service';
import { BoardModel } from './models/board.model';

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
    private readonly boardStoreService: BoardStoreService,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.dataService
      .getExampleBoards$()
      .pipe(take(1))
      .subscribe((boards: BoardModel[]) => {
        this.boardStoreService.setBoards(boards ?? []);
      });
  }
}
