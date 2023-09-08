import { Router } from 'express';

import { cuisineRouter }        from './modules/recipe/cuisine/router';
import { initialDataRouter }    from './modules//initial-data/router';
import { equipmentRouter }      from './modules/equipment/router';
import { equipmentTypeRouter }  from './modules/equipment/type/router';
import { ingredientRouter }     from './modules/ingredient/router';
import { ingredientTypeRouter } from './modules/ingredient/type/router';
import { methodRouter }         from './modules/recipe/method/router';
import { profileRouter }        from './modules/user/profile/router';
import { recipeRouter }         from './modules/recipe/router';
import { recipeTypeRouter }     from './modules/recipe/type/router';
import { searchRouter }         from './modules/search/router';
import { unitRouter }           from './modules/shared/unit/router';
import { userRouter }           from './modules/user/router';

const router = Router();

export function apiV1Router() {
  router.get('/', (req, res) => res.send(`
    No Bullshit Cooking Backend API.
    Documentation at https://github.com/tjalferes/nobullshitcooking-api
  `));
  
  router.use('/user',            userRouter());

  router.use('/cuisine',         cuisineRouter());
  router.use('/data-init',       initialDataRouter());
  router.use('/equipment',       equipmentRouter());
  router.use('/equipment-type',  equipmentTypeRouter());
  router.use('/ingredient',      ingredientRouter());
  router.use('/ingredient-type', ingredientTypeRouter());
  router.use('/unit',            unitRouter());
  router.use('/method',          methodRouter());
  router.use('/profile',         profileRouter());
  router.use('/recipe',          recipeRouter());
  router.use('/recipe-type',     recipeTypeRouter());
  router.use('/search',          searchRouter());
}

// TO DO: add grocer
