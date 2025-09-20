import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  template: `
    <div class="relative inline-block text-left">
      <div (click)="toggle()">
        <ng-content select="[title]"></ng-content>
      </div>

      <div
        class="absolute right-0 z-10 mt-4 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black
      ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
        [class.hidden]="!opened"
        (click)="toggle(false)"
      >
        <ng-content select="[content]"></ng-content>
      </div>
    </div>
  `,
})
export class DropdownComponent {
  opened = false;

  toggle(force?: boolean): void {
    this.opened = force ?? !this.opened;
  }
}
