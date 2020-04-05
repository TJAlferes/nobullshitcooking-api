const { Router } = require('express');

const staffAuthRouter = require('./auth');
const staffCuisineEquipmentRouter = require('./cuisineEquipment');
const staffCuisineIngredientRouter = require('./cuisineIngredient');
const staffCuisineSupplierRouter = require('./cuisineSupplier');
const staffEquipmentRouter = require('./equipment');
const staffIngredientRouter = require('./ingredient');
const staffRecipeRouter = require('./recipe');
const staffSupplierRouter = require('./supplier');

const router = Router();

router.use('/auth', staffAuthRouter);
router.use('/cusine-equipment', staffCuisineEquipmentRouter);
router.use('/cusine-ingredient', staffCuisineIngredientRouter);
router.use('/cusine-supplier', staffCuisineSupplierRouter);
router.use('/equipment', staffEquipmentRouter);
router.use('/ingredient', staffIngredientRouter);
router.use('/recipe', staffRecipeRouter);
router.use('/supplier', staffSupplierRouter);

module.exports = router;