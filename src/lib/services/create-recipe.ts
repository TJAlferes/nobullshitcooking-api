'use strict';

const pool = require('../connections/mysqlPoolConnection');
const esClient = require('../connections/elasticsearchClient');

const Recipe = require('../../mysql-access/Recipe');
import { RecipeMethod, IRecipeMethod } from '../../mysql-access/RecipeMethod';
import { RecipeEquipment, IRecipeEquipment } from '../../mysql-access/RecipeEquipment';
import { RecipeIngredient, IRecipeIngredient } from '../../mysql-access/RecipeIngredient';
import { RecipeSubrecipe, IRecipeSubrecipe } from '../../mysql-access/RecipeSubrecipe';
const RecipeSearch = require('../../elasticsearch-access/RecipeSearch');

const validRecipeMethodsEntity = require('../validations/recipeMethod/recipeMethodEntity');
const validRecipeEquipmentEntity = require('../validations/recipeEquipment/recipeEquipmentEntity');
const validRecipeIngredientsEntity = require('../validations/recipeIngredient/recipeIngredientEntity');
const validRecipeSubrecipesEntity = require('../validations/recipeSubrecipe/recipeSubrecipeEntity');

interface CreateRecipeService {
  ownerId: number
  recipeToCreate: RecipeToCreate
  requiredMethods: []
  requiredEquipment: []
  requiredIngredients: []
  requiredSubrecipes: []
}

interface RecipeToCreate {
  recipeTypeId: number
  cuisineId: number
  authorId: number
  ownerId: number
  title: string
  description: string
  directions: string
  recipeImage: string
  equipmentImage: string
  ingredientsImage: string
  cookingImage: string
}

async function createRecipeService({
  ownerId,
  recipeToCreate,
  requiredMethods,
  requiredEquipment,
  requiredIngredients,
  requiredSubrecipes
}: CreateRecipeService) {
  const recipe = new Recipe(pool);
  const recipeMethod = new RecipeMethod(pool);
  const recipeEquipment = new RecipeEquipment(pool);
  const recipeIngredient = new RecipeIngredient(pool);
  const recipeSubrecipe = new RecipeSubrecipe(pool);
  const recipeSearch = new RecipeSearch(esClient);

  const createdRecipe = await recipe.createRecipe(recipeToCreate);

  const generatedId = createdRecipe.insertId;

  if (requiredMethods.length) {
    let recipeMethodsToCreate: number[] = [];

    requiredMethods.map((rM: IRecipeMethod) => validRecipeMethodsEntity({
      recipeId: generatedId,
      methodId: rM.methodId
    }));

    requiredMethods.map((rM: IRecipeMethod) => {
      recipeMethodsToCreate.push(generatedId, rM.methodId)
    });

    const recipeMethodsPlaceholders = '(?, ?),'
    .repeat(requiredMethods.length)
    .slice(0, -1);

    await recipeMethod.createRecipeMethods(
      recipeMethodsToCreate,
      recipeMethodsPlaceholders
    );
  }

  if (requiredEquipment.length) {
    let recipeEquipmentToCreate: number[] = [];

    requiredEquipment
    .map((rE: IRecipeEquipment) => validRecipeEquipmentEntity({
      recipeId: generatedId,
      equipmentId: rE.equipment,
      amount: rE.amount
    }));

    requiredEquipment.map((rE: IRecipeEquipment) => {
      recipeEquipmentToCreate.push(generatedId, rE.equipment, rE.amount);
    });

    const recipeEquipmentPlaceholders = '(?, ?, ?),'
    .repeat(requiredEquipment.length)
    .slice(0, -1);

    await recipeEquipment.createRecipeEquipment(
      recipeEquipmentToCreate,
      recipeEquipmentPlaceholders
    );
  }

  if (requiredIngredients.length) {
    let recipeIngredientsToCreate: number[] = [];

    requiredIngredients
    .map((rI: IRecipeIngredient) => validRecipeIngredientsEntity({
      recipeId: generatedId,
      ingredientId: rI.ingredient,
      amount: rI.amount,
      measurementId: rI.unit
    }));

    requiredIngredients.map((rI: IRecipeIngredient) => {
      recipeIngredientsToCreate
      .push(generatedId, rI.ingredient, rI.amount, rI.unit);
    });

    const recipeIngredientsPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredIngredients.length)
    .slice(0, -1);

    await recipeIngredient.createRecipeIngredients(
      recipeIngredientsToCreate,
      recipeIngredientsPlaceholders
    );
  }

  if (requiredSubrecipes.length) {
    let recipeSubrecipesToCreate: number[] = [];

    requiredSubrecipes
    .map((rS: IRecipeSubrecipe) => validRecipeSubrecipesEntity({
      recipeId: generatedId,
      subrecipeId: rS.subrecipe,
      amount: rS.amount,
      measurementId: rS.unit
    }));

    requiredSubrecipes.map((rS: IRecipeSubrecipe) => {
      recipeSubrecipesToCreate
      .push(generatedId, rS.subrecipe, rS.amount, rS.unit);
    })

    const recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'
    .repeat(requiredSubrecipes.length)
    .slice(0, -1);

    await recipeSubrecipe.createRecipeSubrecipes(
      recipeSubrecipesToCreate,
      recipeSubrecipesPlaceholders
    );
  }

  if (ownerId === 1) {
    const recipeInfoForElasticSearch = await recipe
    .getPublicRecipeForElasticSearchInsert(generatedId);

    await recipeSearch.saveRecipe(recipeInfoForElasticSearch);
  }
}

module.exports = createRecipeService;