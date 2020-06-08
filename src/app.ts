'use strict';

import { createServer } from 'http';
import express, { Request, Response, NextFunction } from 'express';
import { middlewareInit}  from './middlewareInit';
import { routesInit } from './routesInit';
//import { bulkUp } from './search');

export const app = express();
export const server = createServer(app);

middlewareInit(app, server);  // middlewareInit must be called before routesInit
routesInit(app);

process.on('unhandledRejection', (reason, promise: Promise<any>) => {
  console.log('Unhandled Rejection at:', reason);
});

if (app.get('env') === 'development') {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({error});
  });
} else {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res
    .status(500)
    .json({error: error.message || 'something went wrong'});
  });
}

// move this, and create startup conditional
/*try {
  setTimeout(() => {
    console.log('Now running bulkUp.');
    bulkUp();
  }, 60000);  // at the 1 minute mark
} catch(err) {
  console.log(err);
}*/