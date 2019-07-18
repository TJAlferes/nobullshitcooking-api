const fp = require('lodash/fp')

const pool = require('../../data-access/dbPoolConnection');
const Recipe = require('../../data-access/Recipe');
const RecipeEquipment = require('../../data-access/RecipeEquipment');
const RecipeIngredients = require('../../data-access/RecipeIngredients');
const RecipeSubrecipes = require('../../data-access/RecipeSubrecipes');
const validRecipeEntity = require('../../lib/validations/staff/recipeEntity');  // move out of staff also
const validRecipeEquipmentEntity = require('../../lib/validations/recipeEquipmentEntity');
const validRecipeIngredientsEntity = require('../../lib/validations/staff/recipeIngredientsEntity');
const validRecipeSubrecipesEntity = require('../../lib/validations/staff/recipeSubrecipesEntity');

const staffRecipeController = {
  createRecipe: async function(req, res, next) {
    try {
      const recipeTypeId = req.sanitize(req.body.recipeInfo.recipeTypeId);
      const cuisineId = req.sanitize(req.body.recipeInfo.cuisineId);
      const title = req.sanitize(req.body.recipeInfo.title);
      const description = req.sanitize(req.body.recipeInfo.description);
      const directions = req.sanitize(req.body.recipeInfo.directions);
      const requiredEquipment = req.sanitize(req.body.recipeInfo.requiredEquipment);
      const requiredIngredients = req.sanitize(req.body.recipeInfo.requiredIngredients);
      const requiredSubrecipes = req.sanitize(req.body.recipeInfo.requiredSubrecipes);
      const recipeImage = req.sanitize(req.body.recipeInfo.recipeImage);
      const equipmentImage = req.sanitize(req.body.recipeInfo.equipmentImage);
      const ingredientsImage = req.sanitize(req.body.recipeInfo.ingredientsImage);
      const cookingImage = req.sanitize(req.body.recipeInfo.cookingImage);

      const recipe = new Recipe(pool);
      const recipeToCreate = validRecipeEntity({
        recipeTypeId,
        cuisineId,
        authorId,
        ownerId,
        title,
        description,
        directions,
        recipeImage,
        equipmentImage,
        ingredientsImage,
        cookingImage
      });
      const [ createdRecipe ] = await recipe.createRecipe(recipeToCreate);

      const generatedId = createdRecipe.insertId;

      let resObj = {createRecipe};

      if (requiredEquipment.length > 0) {
        const recipeEquipment = new RecipeEquipment(pool);
        const recipeEquipmentToCreate = recipeEquipment.map(rE => validRecipeEquipmentEntity({
          equipmentId: rE.equipmentId,
          amount: rE.amount
        }));
        const recipeEquipmentPlaceholders = '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1);
        const [ createdRecipeEquipment ] = await recipeEquipment.createRecipeEquipment(
          recipeEquipmentToCreate,
          recipeEquipmentPlaceholders,
          generatedId
        );
        resObj.createdRecipeEquipment = createdRecipeEquipment;
      }

      if (requiredIngredients.length > 0) {
        const recipeIngredients = new RecipeIngredients(pool);
        const recipeIngredientsPlaceholders = '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1);
        const [ createdRecipeIngredients ] = await recipeIngredients.createRecipeIngredients(
          requiredIngredients,
          recipeIngredientsPlaceholders,
          generatedId
        );
        resObj.createdRecipeIngredients = createdRecipeIngredients;
      }

      if (requiredSubrecipes.length > 0) {
        const recipeSubrecipes = new RecipeSubrecipes(pool);
        const recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1);
        const [ createdRecipeSubrecipes ] = await recipeSubrecipes.createRecipeSubrecipes(
          requiredSubrecipes,
          recipeSubrecipesPlaceholders,
          generatedId
        );
        resObj.createdRecipeSubrecipes = createdRecipeSubrecipes;
      }

      res.send(resObj);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateRecipe: async function(req, res, next) {
    try {
      const recipeTypeId = req.sanitize(req.body.recipeInfo.recipeTypeId);
      const cuisineId = req.sanitize(req.body.recipeInfo.cuisineId);
      const title = req.sanitize(req.body.recipeInfo.title);
      const description = req.sanitize(req.body.recipeInfo.description);
      const directions = req.sanitize(req.body.recipeInfo.directions);
      const requiredEquipment = req.sanitize(req.body.recipeInfo.requiredEquipment);
      const requiredIngredients = req.sanitize(req.body.recipeInfo.requiredIngredients);
      const requiredSubrecipes = req.sanitize(req.body.recipeInfo.requiredSubrecipes);
      const recipeImage = req.sanitize(req.body.recipeInfo.recipeImage);
      const equipmentImage = req.sanitize(req.body.recipeInfo.equipmentImage);
      const ingredientsImage = req.sanitize(req.body.recipeInfo.ingredientsImage);
      const cookingImage = req.sanitize(req.body.recipeInfo.cookingImage);

      const recipe = new Recipe(pool);

      const recipeToUpdate = validRecipeEntity({
        recipeTypeId,
        cuisineId,
        title,
        description,
        directions,
        requiredEquipment,
        requiredIngredients,
        requiredSubrecipes,
        recipeImage,
        equipmentImage,
        ingredientsImage,
        cookingImage
      });

      //const [ oldRecipeId ] = await recipe.getRecipeIdByTitle(title);

      //fp.isEqual()

      /*if (not equal) {
        const recipeEquipment = new RecipeEquipment(pool);
        //
      }*/

      /*if (not equal) {
        const recipeIngredients = new RecipeIngredients(pool);
        //
      }*/

      /*if (not equal) {
        const recipeSubrecipes = new RecipeSubrecipes(pool);
        //
      }*/

      const [ row ] = await recipe.updateRecipe(recipeToUpdate);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteRecipe: async function(req, res, next) {
    try {
      const recipeId = req.body.recipeId;  // sanitize and validate?
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.deleteRecipe(recipeId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = staffRecipeController;