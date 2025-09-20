import { Component, Input } from '@angular/core';
import { ISection } from '../../models/interfaces/section.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-homepage-section',
  template: `
    <ng-container *ngIf="section$ | async as section">
      <div class="mt-8 sm:mx-32 2xl:mx-64">
        <div class="px-4 sm:px-0 text-center">
          <h3
            class="text-base font-semibold leading-7 text-gray-900 dark:text-white"
          >
            {{ section.title }}
          </h3>
          <p class="mt-1 text-sm leading-6 dark:text-gray-300 text-gray-500">
            {{ section.description }}
          </p>
        </div>
        <div class="mt-6 border-t border-gray-100 2xl:mx-64">
          <ul class="divide-y divide-gray-100">
            <ng-container *ngFor="let board of section.boards">
              <app-homepage-list-item [board]="board"></app-homepage-list-item>
            </ng-container>
            <ng-container *ngIf="section.additionAllowed">
              <app-homepage-list-button></app-homepage-list-button>
            </ng-container>
          </ul>
        </div>
      </div>
    </ng-container>
  `,
})
export class HomepageSectionComponent {
  @Input()
  section$: Observable<ISection>;
}
