import { Router } from 'express';

import { router as staffAuthRouter } from './auth';
import { router as staffCuisineEquipmentRouter } from './cuisineEquipment';
import { router as staffCuisineIngredientRouter } from './cuisineIngredient';
import { router as staffCuisineSupplierRouter } from './cuisineSupplier';
import { router as staffEquipmentRouter } from './equipment';
import { router as staffIngredientRouter } from './ingredient';
import { router as staffRecipeRouter } from './recipe';
import { router as staffSupplierRouter } from './supplier';

export const router = Router();

router.use('/auth', staffAuthRouter);
router.use('/cusine-equipment', staffCuisineEquipmentRouter);
router.use('/cusine-ingredient', staffCuisineIngredientRouter);
router.use('/cusine-supplier', staffCuisineSupplierRouter);
router.use('/equipment', staffEquipmentRouter);
router.use('/ingredient', staffIngredientRouter);
router.use('/recipe', staffRecipeRouter);
router.use('/supplier', staffSupplierRouter);