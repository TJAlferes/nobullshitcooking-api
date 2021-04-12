import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert, coerce } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { RecipeSearch } from '../../access/elasticsearch';
import {
  Recipe,
  RecipeEquipment,
  RecipeIngredient,
  RecipeMethod,
  RecipeSubrecipe
} from '../../access/mysql';
import { createRecipeService } from '../../lib/services/create-recipe';
import { updateRecipeService } from '../../lib/services/update-recipe';
import { validRecipeEntity } from '../../lib/validations/recipe/entity';

export class UserRecipeController {
  esClient: Client;
  pool: Pool;

  constructor(esClient: Client, pool: Pool) {
    this.esClient = esClient;
    this.pool = pool;
    this.viewPrivate = this.viewPrivate.bind(this);
    this.viewPublic = this.viewPublic.bind(this);
    this.viewPrivateById = this.viewPrivateById.bind(this);
    this.viewPublicById = this.viewPublicById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deletePrivateById = this.deletePrivateById.bind(this);
    this.disownById = this.disownById.bind(this);
  }

  async viewPrivate(req: Request, res: Response) {
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const recipe = new Recipe(this.pool);

    const rows = await recipe.view(author, owner);

    return res.send(rows);
  }

  async viewPublic(req: Request, res: Response) {
    const author = req.session!.userInfo.username;
    const owner = "NOBSC";

    const recipe = new Recipe(this.pool);

    const rows = await recipe.view(author, owner);

    return res.send(rows);
  }

  async viewPrivateById(req: Request, res: Response) {
    const { id } = req.body;
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const recipe = new Recipe(this.pool);

    const [ row ] = await recipe.viewById(id, author, owner);

    return res.send(row);
  }

  async viewPublicById(req: Request, res: Response) {
    const { id } = req.body;
    const author = req.session!.userInfo.username;
    const owner = "NOBSC";

    const recipe = new Recipe(this.pool);

    const [ row ] = await recipe.viewById(id, author, owner);

    return res.send(row);
  }

  async getInfoToEditPrivate(req: Request, res: Response) {
    const { id } = req.body;
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const recipe = new Recipe(this.pool);

    const [ row ] = await recipe.getInfoToEdit(id, author, owner);

    return res.send(row);
  }

  async getInfoToEditPublic(req: Request, res: Response) {
    const { id } = req.body;
    const author = req.session!.userInfo.username;
    const owner = "NOBSC";

    const recipe = new Recipe(this.pool);

    const [ row ] = await recipe.getInfoToEdit(id, author, owner);

    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const {
      ownership,
      type,
      cuisine,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    }= req.body.recipeInfo;
    const author = req.session!.userInfo.username;
    const owner =
      (ownership === "private") ? req.session!.userInfo.username : "NOBSC";
    
    const recipeCreation = {
      type,
      cuisine,
      author,
      owner,
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

    //assert(recipeCreation, validRecipeEntity);
    assert(
      coerce({recipeCreation}, validRecipeEntity),
      validRecipeEntity
    );

    const recipe = new Recipe(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);

    await createRecipeService({
      owner,
      recipeCreation,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipe,
      recipeMethod,
      recipeEquipment,
      recipeIngredient,
      recipeSubrecipe,
      recipeSearch
    });

    return res.send({message: 'Recipe created.'});
  }

  async update(req: Request, res: Response) {
    const {
      id,
      type,
      cuisine,
      ownership,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      video
    }= req.body.recipeInfo;
    const author = req.session!.userInfo.username;
    const owner =
      (ownership === "private") ? req.session!.userInfo.username : "NOBSC";
    
    if (typeof id === "undefined") {
      return res.send({message: 'Invalid recipe ID!'});
    }

    const recipeUpdate = {
      type,
      cuisine,
      author,
      owner,
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

    //assert(recipeUpdate, validRecipeEntity);
    assert(
      coerce({recipeUpdate}, validRecipeEntity),
      validRecipeEntity
    );

    const recipe = new Recipe(this.pool);
    const recipeMethod = new RecipeMethod(this.pool);
    const recipeEquipment = new RecipeEquipment(this.pool);
    const recipeIngredient = new RecipeIngredient(this.pool);
    const recipeSubrecipe = new RecipeSubrecipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);

    await updateRecipeService({
      id,
      author,
      owner,
      recipeUpdate,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipe,
      recipeMethod,
      recipeEquipment,
      recipeIngredient,
      recipeSubrecipe,
      recipeSearch
    });

    return res.send({message: 'Recipe updated.'});
  }

  async deletePrivateById(req: Request, res: Response) {
    const { id } = req.body;
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const recipe = new Recipe(this.pool);

    // TO DO: what about deleting from plans???
    await recipe.deletePrivateById(id, author, owner);

    return res.send({message: 'Recipe deleted.'});
  }

  async disownById(req: Request, res: Response) {
    const { id } = req.body;
    const author = req.session!.userInfo.username;

    const recipe = new Recipe(this.pool);
    const recipeSearch = new RecipeSearch(this.esClient);

    await recipe.disownById(id, author);

    // (make sure the update goes through first though)

    const [ recipeInfoForElasticSearch ] = await recipe.getForElasticSearch(id);

    await recipeSearch.save(recipeInfoForElasticSearch[0]);  // fix?
    
    return res.send({message: 'Recipe disowned.'});
  }
}