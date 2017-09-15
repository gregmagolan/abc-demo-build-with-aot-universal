import './server-polyfills';
import './server-vendor';

import {ApplicationRef, enableProdMode} from '@angular/core';
import {INITIAL_CONFIG, platformServer, PlatformState} from '@angular/platform-server';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {Observable} from 'rxjs/Observable';

import {ServerAppModuleNgFactory} from './app/server-app.module.ngfactory';

require('source-map-support').install();

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Running in', path.resolve());
enableProdMode();

function getDoc(filePath: string, url: string): Observable<string> {
  const index = fs.readFileSync(filePath).toString();
  const platform =
    platformServer([{ provide: INITIAL_CONFIG, useValue: { document: index, url: url } }]);
  return Observable.fromPromise(platform.bootstrapModuleFactory(ServerAppModuleNgFactory))
    .switchMap((moduleRef) => {
      const applicationRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
      return applicationRef.isStable;
    })
    .first((stable) => stable === true)
    .map(() => platform.injector.get(PlatformState).renderToString())
    .finally(() => platform.destroy());
}

const serverRoutes = ['/', '/foo', '/bar'];

function startServer(): void {
  const app = express();
  const port = 8888;

  app.engine('html', universalAotExpressEngine());

  app.set('view engine', 'html');
  app.set('views', path.join(path.resolve(), 'dist'));

  app.use('/', express.static(path.join(path.resolve(), 'dist'), { index: false }));

  serverRoutes.forEach(route => {
    app.get(route, (req: express.Request, res: express.Response) => {
      console.time(`GET: ${req.originalUrl}`);
      res.render('index', { req: req, res: res });
      console.timeEnd(`GET: ${req.originalUrl}`);
    });
  });

  const server = app.listen(port, () => {
    console.log(`Listening on http://localhost:${server.address().port}`);
  });
}

function universalAotExpressEngine() {
  return function(
    filePath: string,
    options: { req: express.Request },
    callback: (err: Error, html: string) => void) {
    getDoc(filePath, options.req.originalUrl).subscribe((doc) => callback(null, doc));
  }
}

startServer();