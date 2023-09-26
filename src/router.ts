import { Router } from 'express';

import { chatgroupUserRouter }  from './modules/chat/group/user/router';
import { chatgroupRouter }      from './modules/chat/group/router';
import { chatmessageRouter }    from './modules/chat/router';
import { chatroomUserRouter }   from './modules/chat/room/user/router';
import { chatroomRouter }       from './modules/chat/room/router';
import { chatUserRouter }       from './modules/chat/user/router';
import { chatRouter }           from './modules/chat/router';
import { equipmentTypeRouter }  from './modules/equipment/type/router';
import { equipmentRouter }      from './modules/equipment/router';
import { ingredientTypeRouter } from './modules/ingredient/type/router';
import { ingredientRouter }     from './modules/ingredient/router';
import { initialDataRouter }    from './modules/initial-data/router';
import { cuisineRouter }        from './modules/recipe/cuisine/router';
import { methodRouter }         from './modules/recipe/method/router';
import { recipeTypeRouter }     from './modules/recipe/type/router';
import { recipeRouter }         from './modules/recipe/router';
import { searchRouter }         from './modules/search/router';
import { unitRouter }           from './modules/shared/unit/router';
import { userRouter }           from './modules/user/router';

const router = Router();

export function apiV1Router() {
  router.get('/', (req, res) => res.send(`
    No Bullshit Cooking Application Programming Interface
    Documentation at https://github.com/tjalferes/nobullshitcooking-api
  `));
  
  router.use('/users', userRouter());

  router.use('/initial-data', initialDataRouter());

  router.use('/search', searchRouter());

  router.use('/cuisines',         cuisineRouter());
  router.use('/equipments',       equipmentRouter());
  router.use('/equipment-types',  equipmentTypeRouter());
  router.use('/ingredients',      ingredientRouter());
  router.use('/ingredient-types', ingredientTypeRouter());
  router.use('/units',            unitRouter());
  router.use('/methods',          methodRouter());
  router.use('/recipes',          recipeRouter());
  router.use('/recipe-types',     recipeTypeRouter());

  /*
  // If it doesn't need to be a socket event, then prefer https req/res
  router.use('/chatgroups',   chatgroupsRouter());
  router.use('/chatrooms',    chatroomsRouter());
  router.use('/chatmessages', chatmessagesRouter());
  */
}
