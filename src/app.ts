'use strict';

import { createServer } from 'http';
import express, { Request, Response, NextFunction } from 'express';
import { middlewareInit}  from './middlewareInit';
import { routesInit } from './routesInit';
import { bulkUp } from './search';

const app = express();
const server = createServer(app);

middlewareInit(app, server);  // must be called before routesInit
routesInit(app);

process.on('unhandledRejection', (reason, promise: Promise<any>) => {
  console.log('Unhandled Rejection at:', reason);
});

if (app.get('env') === 'production') {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res
    .status(500)
    .json({error: error.message || 'something went wrong'});
  });
} else {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({error});
  });
}

// move this, and create startup conditional
try {
  setTimeout(() => {
    console.log('Now running bulkUp.');
    bulkUp();
  }, 60000);  // at the 1 minute mark
} catch(err) {
  console.log(err);
}

module.exports = {app, server};