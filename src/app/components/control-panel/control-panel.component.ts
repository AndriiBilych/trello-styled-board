import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BoardStoreService } from '../../services/board-store.service';
import { RoutingService } from '../../services/routing.service';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
})
export class ControlPanelComponent {
  @ViewChild('DeleteModal') confirmation: ElementRef;
  #isChangingName = false;

  #darkModeService = inject(DarkModeService);
  #translateService = inject(TranslateService);

  constructor(
    public readonly boardStoreService: BoardStoreService,
    public readonly routingService: RoutingService,
  ) {
    this.#isChangingName = false;
  }

  get isChangingName(): boolean {
    return this.#isChangingName;
  }

  removeBoard(id: string): void {
    this.boardStoreService.removeBoard(id);
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
}
