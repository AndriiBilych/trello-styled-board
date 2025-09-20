import { Component, inject, Input } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { TranslateService } from '@ngx-translate/core';

import { BoardModel } from '../../models/board.model';
import { BoardStoreService } from '../../services/board-store.service';

@Component({
  selector: 'app-homepage',
  template: `
    <div class="pt-14">
      <app-homepage-section [section$]="section$"></app-homepage-section>
    </div>
  `,
})
export class HomepageComponent {
  @Input() loadBoard: (id: string) => void;
  @Input() createBoard: () => void;

  translateService = inject(TranslateService);

  section$ = this.boardStoreService.boards$.pipe(
    filter((boards: BoardModel[] | null) => isNotNullOrUndefined(boards)),
    map((boards) => {
      return {
        id: '0',
        title: this.translateService.instant('section.title'),
        description: this.translateService.instant('section.description'),
        additionAllowed: true,
        boards,
      };
    }),
  );

  constructor(private readonly boardStoreService: BoardStoreService) {}
}
