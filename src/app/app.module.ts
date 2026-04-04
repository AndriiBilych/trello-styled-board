import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { ListComponent } from './components/list/list.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { InputFormComponent } from './components/inputs/input-form/input-form.component';
import { TaskComponent } from './components/task/task.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { HomepageSectionComponent } from './components/homepage-section/homepage-section.component';
import { HomepageListItemComponent } from './components/homepage-list-item/homepage-list-item.component';
import { HomepageListButtonComponent } from './components/homepage-list-button/homepage-list-button.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { ListPlaceholderComponent } from './components/list-placeholder/list-placeholder.component';
import { AddListComponent } from './components/inputs/add-list/add-list.component';
import { TaskPlaceholderComponent } from './components/task-placeholder/task-placeholder.component';
import { AddTaskComponent } from './components/inputs/add-task/add-task.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { boardsReducer } from './state/boards.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import {BoardsEffects} from './state/boards.effects';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ListComponent,
    ControlPanelComponent,
    InputFormComponent,
    AddListComponent,
    AddTaskComponent,
    TaskComponent,
    ColorPickerComponent,
    HomepageComponent,
    HomepageSectionComponent,
    HomepageListItemComponent,
    HomepageListButtonComponent,
    NotFoundPageComponent,
    ListPlaceholderComponent,
    TaskPlaceholderComponent,
    DropdownComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      boards: boardsReducer,
    }),

    // ngx-translate and the loader module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),

    EffectsModule.forRoot(BoardsEffects),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
