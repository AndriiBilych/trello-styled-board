import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { RoutingService } from '../../services/routing.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { Store } from '@ngrx/store';
import { boardsActions } from '../../state/boards.actions';
import { selectSelectedBoard } from '../../state/boards.selectors';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
})
export class ControlPanelComponent {
  @ViewChild('DeleteModal') confirmation: ElementRef;
  #isChangingName = false;

  #darkModeService = inject(DarkModeService);
  #translateService = inject(TranslateService);

  selectedBoard = this.store.select(selectSelectedBoard);

  constructor(
    public readonly store: Store,
    public readonly routingService: RoutingService,
  ) {
    this.#isChangingName = false;
  }

  get isChangingName(): boolean {
    return this.#isChangingName;
  }

  removeBoard(id: string): void {
    this.store.dispatch(boardsActions.removeBoard({ payload: id }));
    this.routingService.routeToHomepage();
  }

  toggleIsChangingName(force?: boolean): void {
    this.#isChangingName = force ?? !this.#isChangingName;
  }

  toggleDarkMode(force?: boolean): void {
    this.#darkModeService.toggleDarkMode(force);
  }

  useEnglish(): void {
    this.#translateService.use('en');
  }

  usePolish(): void {
    this.#translateService.use('pl');
  }

  get isEnglish(): boolean {
    return this.#translateService.currentLang === 'en';
  }

  get isPolish(): boolean {
    return this.#translateService.currentLang === 'pl';
  }

  renameBoard(id: string, title: string): void {
    this.store.dispatch(boardsActions.renameBoard({ id, title }));
  }
}
