import bcrypt                from 'bcrypt';
import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';
import { assert }            from 'superstruct';
import { v4 as uuidv4 }      from 'uuid';

import {
  User,
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
import { emailConfirmationCode } from '../../lib/services';
import {
  validUserRegisterRequest,
  validRegister,
  validResendRequest,
  validResend,
  validVerifyRequest,
  validVerify,
  validCreatingUser,
  validUpdatingUser,
  validLoginRequest,
  validLogin
} from '../../lib/validations';
import { io } from '../../index';

const SALT_ROUNDS = 10;

export class UserAuthController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async register(req: Request, res: Response) {
    const { email, pass, username } = req.body.userInfo;
    assert({email, pass, username}, validUserRegisterRequest);

    const user = new User(this.pool);
    const feedback = await validRegister({email, pass, name: username}, user);
    if (feedback !== "valid") return res.send({message: feedback});

    const encryptedPass = await bcrypt.hash(pass, SALT_ROUNDS);
    const confirmationCode = uuidv4();
    const args = {email, pass: encryptedPass, username, confirmationCode};
    assert(args, validCreatingUser);
    
    await user.create(args);
    emailConfirmationCode(email, confirmationCode);

    return res.send({message: 'User account created.'});
  }

  async verify(req: Request, res: Response) {
    const { email, pass, confirmationCode } = req.body.userInfo;
    assert({email, pass, confirmationCode}, validVerifyRequest);

    const user = new User(this.pool);
    const feedback = await validVerify({email, pass, confirmationCode}, user);
    if (feedback !== "valid") return res.send({message: feedback});

    user.verify(email);

    return res.send({message: 'User account verified.'});
  }

  async resendConfirmationCode(req: Request, res: Response) {
    const { email, pass } = req.body.userInfo;
    assert({email, pass}, validResendRequest);

    const user = new User(this.pool);
    const feedback = await validResend({email, pass}, user);
    if (feedback !== "valid") return res.send({message: feedback});
    
    const confirmationCode = uuidv4();
    emailConfirmationCode(email, confirmationCode);

    return res.send({message: 'Confirmation code re-sent.'});
  }

  async login(req: Request, res: Response) {
    const loggedIn = req.session.userInfo?.id;
    if (loggedIn) return res.json({message: 'Already logged in.'});
    
    const { email, pass } = req.body.userInfo;
    assert({email, pass}, validLoginRequest);

    const user = new User(this.pool);
    const { feedback, exists } = await validLogin({email, pass}, user);
    if (feedback !== "valid" || !exists) return res.send({message: feedback});

    const { id, username } = exists;
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
