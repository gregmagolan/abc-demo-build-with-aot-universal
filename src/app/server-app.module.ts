import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';

import {AppComponent} from './app.component';
import {AppModule} from './app.module';

@NgModule({
  bootstrap: [AppComponent],
  imports: [BrowserModule.withServerTransition({ appId: 'my-app-id' }), ServerModule, AppModule]
})
export class ServerAppModule {}
