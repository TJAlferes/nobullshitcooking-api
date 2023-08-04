import { Request, Response } from 'express';
import { assert }            from 'superstruct';
import { v4 as uuidv4 }      from 'uuid';

import {
  UserRepo,
  FriendshipRepo,
  PlanRepo,
  EquipmentRepo,
  IngredientRepo,
  RecipeRepo,
  RecipeEquipmentRepo,
  RecipeIngredientRepo,
  RecipeMethodRepo,
  RecipeSubrecipeRepo,
  FavoriteRecipeRepo,
  SavedRecipeRepo
} from '../../access/mysql';
import { io } from '../../index';

export class UserAuthController {
  async register(req: Request, res: Response) {
    const { email, password, username } = req.body.userInfo;

    const userRepo = new UserRepo();
    await createUserService({email, password, username, userRepo});

    return res.send({message: 'User account created.'});  // or .status and .json ?
  }

  async resendConfirmationCode(req: Request, res: Response) {
    const { email, password } = req.body.userInfo;

    const userRepo = new UserRepo();
    await resendConfirmationCodeService({email, password, userRepo});

    return res.send({message: 'Confirmation code re-sent.'});
  }

  async verify(req: Request, res: Response) {
    const { email, password, confirmationCode } = req.body.userInfo;

    const userRepo = new UserRepo();
    await verifyService({email, password, confirmationCode, userRepo});

    return res.send({message: 'User account verified.'});
  }

  async login(req: Request, res: Response) {
    const loggedIn = req.session.userInfo?.id;
    if (loggedIn) return res.json({message: 'Already logged in.'});  // throw ?
    
    const { email, password } = req.body.userInfo;
    const userRepo = new UserRepo();
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
    
    if (id === 1) return res.end();  // IMPORTANT: Do not allow user 1, NOBSC, to be changed.  (THIS IS A BUSINESS RULE, move this BUSINESS LOGIC TO THE DOMAIN MODEL)

    const encryptedPass = await bcrypt.hash(pass, SALT_ROUNDS);
    const args = {email, pass: encryptedPass, username};
    assert(args, validUpdatingUser);

    const userRepo = new UserRepo();
    await userRepo.update({id, ...args});

    return res.send({message: 'Account updated.'});
  }

  async delete(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;

    if (userId === 1) return res.end();  // IMPORTANT: Never allow user 1, NOBSC, to be deleted.

    const equipmentRepo =        new EquipmentRepo();
    const favoriteRecipeRepo =   new FavoriteRecipeRepo();
    const friendshipRepo =       new FriendshipRepo();
    const ingredientRepo =       new IngredientRepo();
    const planRepo =             new PlanRepo();
    const recipeRepo =           new RecipeRepo();
    const recipeEquipmentRepo =  new RecipeEquipmentRepo();
    const recipeIngredientRepo = new RecipeIngredientRepo();
    const recipeMethodRepo =     new RecipeMethodRepo();
    const recipeSubrecipeRepo =  new RecipeSubrecipeRepo();
    const savedRecipeRepo =      new SavedRecipeRepo();
    const userRepo =             new UserRepo();

    // NOTE: Due to foreign key constraints, deletes must be in this order. (Do this in MySQL instead?) (WHAT!?)

    // First delete/disown the user's relationships and content...
    await Promise.all([
      friendshipRepo.deleteAllByUserId(userId),
      planRepo.deleteAll(userId),
      favoriteRecipeRepo.deleteAllByUserId(userId),
      savedRecipeRepo.deleteAllByUserId(userId)
    ]);
    await recipeRepo.disownAllByAuthorId(userId);
    const recipeIds = await recipeRepo.getPrivateIds(userId);  // CAREFUL! Double check this.
    await Promise.all([
      recipeEquipmentRepo.deleteByRecipeIds(recipeIds),
      recipeIngredientRepo.deleteByRecipeIds(recipeIds),
      recipeMethodRepo.deleteByRecipeIds(recipeIds),
      recipeSubrecipeRepo.deleteByRecipeIds(recipeIds),
      recipeSubrecipeRepo.deleteBySubrecipeIds(recipeIds)
    ]);
    await recipeRepo.deleteAllByOwnerId(userId);  // CAREFUL! Double check this.
    await Promise.all([equipmentRepo.deleteAll(userId), ingredientRepo.deleteAll(userId)]);

    // ... Then delete the user.
    await userRepo.deleteById(userId);

    return res.send({message: 'Account deleted.'});
  }
}
