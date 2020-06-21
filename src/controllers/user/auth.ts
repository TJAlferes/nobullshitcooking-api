import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { assert } from 'superstruct';
import { v4 as uuidv4 } from 'uuid';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  emailConfirmationCode
} from '../../lib/services/email-confirmation-code';
import {
  validRegisterRequest,
  validRegister,
  validUserEntity,
  validVerifyRequest,
  validVerify,
  validResend,
  validLoginRequest,
  validLogin,
  validUpdatingUser
} from '../../lib/validations/user/index';
import { Content } from '../../mysql-access/Content';
import { Equipment } from '../../mysql-access/Equipment';
import { Ingredient } from '../../mysql-access/Ingredient';
import { FavoriteRecipe } from '../../mysql-access/FavoriteRecipe';
import { Friendship } from '../../mysql-access/Friendship';
//import { Notification } from '../../mysql-access/Notification';
import { Plan } from '../../mysql-access/Plan';
import { Recipe } from '../../mysql-access/Recipe';
import { SavedRecipe } from '../../mysql-access/SavedRecipe';
import { User } from '../../mysql-access/User';

const SALT_ROUNDS = 10;

export const userAuthController = {
  register: async function(req: Request, res: Response) {
    const email = req.body.userInfo.email;
    const pass = req.body.userInfo.password;
    const username = req.body.userInfo.username;

    assert({email, pass, username}, validRegisterRequest);

    const user = new User(pool);

    const {
      valid,
      feedback
    } = await validRegister({email, pass, username}, user);

    if (!valid) return res.send({message: feedback});

    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

    const confirmationCode = uuidv4();

    const userToCreate = {
      email,
      pass: encryptedPassword,
      username,
      confirmationCode
    };

    assert(userToCreate, validUserEntity);

    await user.createUser(userToCreate);

    emailConfirmationCode(email, confirmationCode);

    return res.send({message: 'User account created.'});
  },
  verify: async function(req: Request, res: Response) {
    const email = req.body.userInfo.email;
    const pass = req.body.userInfo.password;
    const confirmationCode = req.body.userInfo.confirmationCode;

    assert({email, pass, confirmationCode}, validVerifyRequest);

    const user = new User(pool);

    const {
      valid,
      feedback
    } = await validVerify({email, confirmationCode}, user);

    if (!valid) return res.send({message: feedback});

    //user.verifyUser(email);  // change from uuid to null

    return res.send('User account verified.');
  },
  resendConfirmationCode: async function (req: Request, res: Response) {
    const email = req.body.userInfo.email;
    const pass = req.body.userInfo.password;

    assert({email, pass}, validLoginRequest);

    const user = new User(pool);

    const { valid, feedback } = await validResend({email, pass}, user);

    if (!valid) return res.send({message: feedback});

    const confirmationCode = uuidv4();

    emailConfirmationCode(email, confirmationCode);

    return res.send({message: 'Confirmation code re-sent.'});
  },
  login: async function(req: Request, res: Response) {
    const email = req.body.userInfo.email;
    const pass = req.body.userInfo.password;

    assert({email, pass}, validLoginRequest);

    const user = new User(pool);

    const {
      valid,
      feedback,
      userExists
    } = await validLogin({email, pass}, user);

    if (!valid) return res.send({message: feedback});

    req.session!.userInfo = {};
    req.session!.userInfo.userId = userExists!.user_id;
    req.session!.userInfo.username = userExists!.username;
    req.session!.userInfo.avatar = userExists!.avatar;

    return res.json({
      message: 'Signed in.',
      username: userExists!.username,
      avatar: userExists!.avatar
    });
  },
  logout: async function(req: Request, res: Response) {
    req.session!.destroy(function() {});
    return res.end();
  },
  updateUser: async function(req: Request, res: Response) {
    const email = req.body.userInfo.email;
    const pass = req.body.userInfo.password;
    const username = req.body.userInfo.username;
    const avatar = req.body.userInfo.avatar;

    const userId = req.session!.userInfo.userId;

    const userToUpdateWith = {email, pass, username, avatar};

    assert(userToUpdateWith, validUpdatingUser);

    const user = new User(pool);

    await user.updateUser({userId, ...userToUpdateWith});
    
    return res.send({message: 'Account updated.'});
  },
  deleteUser: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;

    const content = new Content(pool);
    const equipment = new Equipment(pool);
    const favoriteRecipe = new FavoriteRecipe(pool);
    const friendship = new Friendship(pool);
    const ingredient = new Ingredient(pool);
    //const notification = new Notification(pool);
    const plan = new Plan(pool);
    const recipe = new Recipe(pool);
    const savedRecipe = new SavedRecipe(pool);
    const user = new User(pool);

    // deletes must be in this order, due to foreign key constraints

    await Promise.all([
      content.deleteAllMyContent(userId),  // move out and up?
      friendship.deleteMyFriendships(userId),
      plan.deleteAllMyPrivatePlans(userId),
      favoriteRecipe.deleteAllMyFavoriteRecipes(userId),
      savedRecipe.deleteAllMySavedRecipes(userId)
    ]);

    /*?*/
    await recipe.disownAllMyPublicUserRecipes(userId);
    /*await recipeMethod.deleteRecipeMethods(recipeId);
    await recipeEquipment.deleteRecipeEquipment(recipeId);
    await recipeIngredient.deleteRecipeIngredients(recipeId);
    await recipeSubrecipe.deleteRecipeSubrecipes(recipeId);
    await recipeSubrecipe.deleteRecipeSubrecipesBySubrecipeId(recipeId);*/
    await recipe.deleteAllMyPrivateUserRecipes(userId, userId);

    await Promise.all([
      equipment.deleteAllMyPrivateUserEquipment(userId),
      ingredient.deleteAllMyPrivateUserIngredients(userId)
    ]);

    await user.deleteUser(userId);

    return res.send({message: 'Account deleted.'});
  }
};