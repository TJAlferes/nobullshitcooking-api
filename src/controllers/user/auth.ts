import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';
import { assert }            from 'superstruct';
import { v4 as uuidv4 }      from 'uuid';

import {
  UserRepository,
  Friendship,
  Plan,
  Equipment,
  Ingredient,
  Recipe,
  RecipeEquipment,
  RecipeIngredient,
  RecipeMethod,
  RecipeSubrecipe,
  FavoriteRecipe,
  SavedRecipe
} from '../../access/mysql';
import { io } from '../../index';

export class UserAuthController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async register(req: Request, res: Response) {
    const { email, password, username } = req.body.userInfo;

    const userRepo = new UserRepository(this.pool);
    await createUserService({email, password, username, userRepo});

    return res.send({message: 'User account created.'});  // or .status and .json ?
  }

  async resendConfirmationCode(req: Request, res: Response) {
    const { email, password } = req.body.userInfo;

    const userRepo = new UserRepository(this.pool);
    await resendConfirmationCodeService({email, password, userRepo});

    return res.send({message: 'Confirmation code re-sent.'});
  }

  async verify(req: Request, res: Response) {
    const { email, password, confirmationCode } = req.body.userInfo;

    const userRepo = new UserRepository(this.pool);
    await verifyService({email, password, confirmationCode, userRepo});

    return res.send({message: 'User account verified.'});
  }

  async login(req: Request, res: Response) {
    const loggedIn = req.session.userInfo?.id;
    if (loggedIn) return res.json({message: 'Already logged in.'});  // throw ?
    
    const { email, password } = req.body.userInfo;
    const userRepo = new UserRepository(this.pool);
    const { id, username } = await loginService(email, password, userRepo);

    req.session.userInfo = {id, username};
    return res.json({message: 'Signed in.', username});
  }

  async logout(req: Request, res: Response) {
    const sessionId = req.session.id;

    req.session!.destroy(function() {
      io.in(sessionId).disconnectSockets();
      res.status(204);
    });

    return res.end();
  }

  async update(req: Request, res: Response) {
    const { email, pass, username } = req.body.userInfo;
    const id = req.session.userInfo!.id;
    
    if (id === 1) return res.end();  // IMPORTANT: Do not allow user 1, NOBSC, to be changed.

    const encryptedPass = await bcrypt.hash(pass, SALT_ROUNDS);
    const args = {email, pass: encryptedPass, username};
    assert(args, validUpdatingUser);

    const user = new User(this.pool);
    await user.update({id, ...args});

    return res.send({message: 'Account updated.'});
  }

  async delete(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;

    if (userId === 1) return res.end();  // IMPORTANT: Never allow user 1, NOBSC, to be deleted.

    const equipment =        new Equipment(this.pool);
    const favoriteRecipe =   new FavoriteRecipe(this.pool);
    const friendship =       new Friendship(this.pool);
    const ingredient =       new Ingredient(this.pool);
    const plan =             new Plan(this.pool);
    const recipe =           new Recipe(this.pool);
    const recipeEquipment =  new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeMethod =     new RecipeMethod(this.pool);
    const recipeSubrecipe =  new RecipeSubrecipe(this.pool);
    const savedRecipe =      new SavedRecipe(this.pool);
    const user =             new User(this.pool);

    // NOTE: Due to foreign key constraints, deletes must be in this order. (Do this in MySQL instead?)

    // First delete/disown the user's relationships and content...
    await Promise.all([
      friendship.deleteAllByUserId(userId),
      plan.deleteAll(userId),
      favoriteRecipe.deleteAllByUserId(userId),
      savedRecipe.deleteAllByUserId(userId)
    ]);
    await recipe.disownAllByAuthorId(userId);
    const recipeIds = await recipe.getPrivateIds(userId);  // CAREFUL! Double check this.
    await Promise.all([
      recipeEquipment.deleteByRecipeIds(recipeIds),
      recipeIngredient.deleteByRecipeIds(recipeIds),
      recipeMethod.deleteByRecipeIds(recipeIds),
      recipeSubrecipe.deleteByRecipeIds(recipeIds),
      recipeSubrecipe.deleteBySubrecipeIds(recipeIds)
    ]);
    await recipe.deleteAllByOwnerId(userId);  // CAREFUL! Double check this.
    await Promise.all([equipment.deleteAll(userId), ingredient.deleteAll(userId)]);

    // ... Then delete the user.
    await user.deleteById(userId);

    return res.send({message: 'Account deleted.'});
  }
}
