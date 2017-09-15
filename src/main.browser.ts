import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
import {BrowserAppModuleNgFactory} from './app/browser-app.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(BrowserAppModuleNgFactory);
