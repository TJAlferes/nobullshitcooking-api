import { Router } from 'express';
import { body }   from 'express-validator';

import { chatController }              from './controller';
import { catchExceptions, userIsAuth } from '../../utils';

const router = Router();

// for /chat

// THIS IS LIKELY NOT NEEDED, DELETE THIS FILE

export function chatRouter() {
  router.
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
