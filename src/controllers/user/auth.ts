import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { v4 as uuidv4 } from 'uuid';

import { Content } from '../../access/mysql/Content';
import { Equipment } from '../../access/mysql/Equipment';
import { Ingredient } from '../../access/mysql/Ingredient';
import { FavoriteRecipe } from '../../access/mysql/FavoriteRecipe';
import { Friendship } from '../../access/mysql/Friendship';
//import { Notification } from '../../access/mysql/Notification';
import { Plan } from '../../access/mysql/Plan';
import { Recipe } from '../../access/mysql/Recipe';
import { RecipeEquipment } from '../../access/mysql/RecipeEquipment';
import { RecipeIngredient } from '../../access/mysql/RecipeIngredient';
import { RecipeMethod } from '../../access/mysql/RecipeMethod';
import { RecipeSubrecipe } from '../../access/mysql/RecipeSubrecipe';
import { SavedRecipe } from '../../access/mysql/SavedRecipe';
import { User } from '../../access/mysql/User';
import {
  emailConfirmationCode
} from '../../lib/services/email-confirmation-code';
import {
  validLogin,
  validLoginRequest,
  validRegister,
  validRegisterRequest,
  validResend,
  validUserCreation,
  validUserUpdate,
  validVerify,
  validVerifyRequest
} from '../../lib/validations/user/index';

const SALT_ROUNDS = 10;

export class UserAuthController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.register = this.register.bind(this);
    this.verify = this.verify.bind(this);
    this.resendConfirmationCode = this.resendConfirmationCode.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async register(req: Request, res: Response) {
    const { email, password: pass, username } = req.body.userInfo;
    assert({email, pass, username}, validRegisterRequest);
    // why here? why not in the service/validation?
    const user = new User(this.pool);
    const { valid, feedback } =
      await validRegister({email, pass, username}, user);
    if (!valid) return res.send({message: feedback});
    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
    const confirmationCode = uuidv4();
    const userToCreate = {
      email,
      pass: encryptedPassword,
      username,
      confirmationCode
    };
    assert(userToCreate, validUserCreation);
    await user.create(userToCreate);
    emailConfirmationCode(email, confirmationCode);
    return res.send({message: 'User account created.'});
  }

  async verify(req: Request, res: Response) {
    const { email, password: pass, confirmationCode } = req.body.userInfo;
    assert({email, pass, confirmationCode}, validVerifyRequest);
    const user = new User(this.pool);
    const isValidVerify =
      await validVerify({email, pass, confirmationCode}, user);
    if (!isValidVerify.valid) {
      return res.send({message: isValidVerify.feedback});
    }
    user.verify(email);
    return res.send({message: 'User account verified.'});
  }

  async resendConfirmationCode(req: Request, res: Response) {
    const { email, password: pass } = req.body.userInfo;
    assert({email, pass}, validLoginRequest);
    const user = new User(this.pool);
    const { valid, feedback } = await validResend({email, pass}, user);
    if (!valid) return res.send({message: feedback});
    const confirmationCode = uuidv4();
    emailConfirmationCode(email, confirmationCode);
    return res.send({message: 'Confirmation code re-sent.'});
  }

  async login(req: Request, res: Response) {
    const { email, password: pass } = req.body.userInfo;
    assert({email, pass}, validLoginRequest);
    const user = new User(this.pool);
    const { valid, feedback, userExists } =
      await validLogin({email, pass}, user);
    if (!valid || !userExists) return res.send({message: feedback});
    req.session!.userInfo = {};
    req.session!.userInfo.id = userExists.id;
    req.session!.userInfo.username = userExists.username;
    req.session!.userInfo.avatar = userExists.avatar;
    return res.json({
      message: 'Signed in.',
      username: userExists.username,
      avatar: userExists.avatar
    });
  }

  async logout(req: Request, res: Response) {
    req.session!.destroy(function() {});
    return res.end();
  }

  async update(req: Request, res: Response) {
    const { email, password: pass, username, avatar } = req.body.userInfo;
    const id = req.session!.userInfo.id;
    const userToUpdateWith = {email, pass, username, avatar};
    assert(userToUpdateWith, validUserUpdate);
    const user = new User(this.pool);
    await user.update({id, ...userToUpdateWith});
    // shouldn't it send the updated values back? const [ updatedUser ] = await
    return res.send({message: 'Account updated.'});
  }

  async delete(req: Request, res: Response) {
    const userId = req.session!.userInfo.id;
    const content = new Content(this.pool);
    const equipment = new Equipment(this.pool);
    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const friendship = new Friendship(this.pool);
    const ingredient = new Ingredient(this.pool);
    //const notification = new Notification(this.pool);
    const plan = new Plan(this.pool);
    const recipe = new Recipe(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const savedRecipe = new SavedRecipe(this.pool);
    const user = new User(this.pool);
    // NOTE: Due to foreign key constraints, deletes must be in this order:
    await Promise.all([
      content.deleteAllByOwnerId(userId),  // move out and up?
      friendship.deleteAllByUserId(userId),
      plan.deleteAllByOwnerId(userId),
      favoriteRecipe.deleteAllByUserId(userId),
      savedRecipe.deleteAllByUserId(userId)
    ]);
    /*?*/
    await recipe.disown(userId);
    const recipeIds =
      await recipe.getAllPrivateIdsByUserId(userId) as number[];
    await Promise.all([
      recipeEquipment.deleteByRecipeIds(recipeIds),
      recipeIngredient.deleteByRecipeIds(recipeIds),
      recipeMethod.deleteByRecipeIds(recipeIds),
      recipeSubrecipe.deleteByRecipeIds(recipeIds),
      recipeSubrecipe.deleteBySubrecipeIds(recipeIds)
    ]);
    await recipe.deletePrivate(userId, userId);
    await Promise.all([
      equipment.deleteAllByOwnerId(userId),
      ingredient.deleteAllByOwnerId(userId)
    ]);
    await user.delete(userId);
    return res.send({message: 'Account deleted.'});
  }
}