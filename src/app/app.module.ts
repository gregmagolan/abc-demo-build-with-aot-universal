import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';

@NgModule(
  { imports: [CommonModule, FormsModule], declarations: [AppComponent], exports: [AppComponent] })
export class AppModule {}
