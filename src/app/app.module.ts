import { NgModule } from '@angular/core';
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
import { reducer } from './state/reducer';

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
      app: reducer,
    }),

    // ngx-translate and the loader module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
