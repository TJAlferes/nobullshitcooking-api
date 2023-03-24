import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Recipe, RecipeEquipment, RecipeIngredient, RecipeMethod, RecipeSubrecipe } from '../../access/mysql';
import { createRecipeService, updateRecipeService } from '../../lib/services';
import { validRecipe } from '../../lib/validations';

export class UserRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllPrivate = this.viewAllPrivate.bind(this);
    this.viewAllPublic =  this.viewAllPublic.bind(this);
    this.viewOnePrivate = this.viewOnePrivate.bind(this);
    this.viewOnePublic =  this.viewOnePublic.bind(this);
    this.create =         this.create.bind(this);
    this.editPrivate =    this.editPrivate.bind(this);
    this.editPublic =     this.editPublic.bind(this);
    this.update =         this.update.bind(this);
    this.deleteOne =      this.deleteOne.bind(this);
    this.disownOne =      this.disownOne.bind(this);
  }

  async viewAllPrivate(req: Request, res: Response) {
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const recipe = new Recipe(this.pool);
    const rows = await recipe.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewAllPublic(req: Request, res: Response) {
    const authorId = req.session.userInfo!.id;
    const ownerId =  1;

    const recipe = new Recipe(this.pool);
    const rows = await recipe.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewOnePrivate(req: Request, res: Response) {
    const title =    req.body.title;
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.viewOne(title, authorId, ownerId);
    return res.send(row);
  }

  async viewOnePublic(req: Request, res: Response) {
    const title =    req.body.title;
    const authorId = req.session.userInfo!.id;
    const ownerId =  1;

    const recipe = new Recipe(this.pool)
    const [ row ] = await recipe.viewOne(title, authorId, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId =    Number(req.body.recipeInfo.cuisineId);
    const {
      ownership,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      methods,
      equipment,
      ingredients,
      subrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    } = req.body.recipeInfo;
    const authorId = req.session.userInfo!.id;
    const ownerId = (ownership === "private") ? req.session.userInfo!.id : 1;

    const creatingRecipe = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    };
    assert(creatingRecipe, validRecipe);

    const recipe =           new Recipe(this.pool);
    const recipeMethod =     new RecipeMethod(this.pool);
    const recipeEquipment =  new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe =  new RecipeSubrecipe(this.pool);
    await createRecipeService({
      creatingRecipe,
      methods,
      equipment,
      ingredients,
      subrecipes,
      recipe,
      recipeMethod,
      recipeEquipment,
      recipeIngredient,
      recipeSubrecipe
    });

    return res.send({message: 'Recipe created.'});
  }

  async editPrivate(req: Request, res: Response) {
    const id =       Number(req.body.id);
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.edit(id, authorId, ownerId);
    return res.send(row);
  }

  async editPublic(req: Request, res: Response) {
    const id =       Number(req.body.id);
    const authorId = req.session.userInfo!.id;
    const ownerId =  1;

    const recipe = new Recipe(this.pool);
    const [ row ] = await recipe.edit(id, authorId, ownerId);
    return res.send(row);
  }

  async update(req: Request, res: Response) {
    const id =           Number(req.body.recipeInfo.id);
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId =    Number(req.body.recipeInfo.cuisineId);
    const {
      ownership,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      methods,
      equipment,
      ingredients,
      subrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    }= req.body.recipeInfo;
    const authorId = req.session.userInfo!.id;
    const ownerId = (ownership === "private") ? req.session.userInfo!.id : 1;
    if (typeof id === "undefined") return res.send({message: 'Invalid recipe ID!'});

    const updatingRecipe = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    };
    assert(updatingRecipe, validRecipe);

    const recipe =           new Recipe(this.pool);
    const recipeMethod =     new RecipeMethod(this.pool);
    const recipeEquipment =  new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe =  new RecipeSubrecipe(this.pool);
    await updateRecipeService({
      recipeId: id,
      updatingRecipe,
      methods,
      equipment,
      ingredients,
      subrecipes,
      recipe,
      recipeMethod,
      recipeEquipment,
      recipeIngredient,
      recipeSubrecipe
    });

    return res.send({message: 'Recipe updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    // transaction(s)?: TO DO: TRIGGERS
    const id =       Number(req.body.id);
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    //const favoriteRecipe =   new FavoriteRecipe(this.pool);
    //const savedRecipe =      new SavedRecipe(this.pool);
    const recipeEquipment =  new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeMethod =     new RecipeMethod(this.pool);
    const recipeSubrecipe =  new RecipeSubrecipe(this.pool);
    await Promise.all([
      //favoriteRecipe.deleteAllByRecipeId(id),
      //savedRecipe.deleteAllByRecipeId(id),
      recipeEquipment.deleteByRecipeId(id),
      recipeIngredient.deleteByRecipeId(id),
      recipeMethod.deleteByRecipeId(id),
      recipeSubrecipe.deleteByRecipeId(id),
      recipeSubrecipe.deleteBySubrecipeId(id)
    ]);

    // TO DO: what about deleting from plans???
    const recipe = new Recipe(this.pool);
    await recipe.deleteOne(id, authorId, ownerId);

    return res.send({message: 'Recipe deleted.'});
  }

  async disownOne(req: Request, res: Response) {
    const id =       Number(req.body.id);
    const authorId = req.session.userInfo!.id;

    const recipe = new Recipe(this.pool);
    await recipe.disownOne(id, authorId);

    return res.send({message: 'Recipe disowned.'});
  }
}