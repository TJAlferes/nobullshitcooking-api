import { Router } from 'express';

export { router as staffAuthRouter } from './auth';
export { router as staffCuisineEquipmentRouter } from './cuisineEquipment';
export { router as staffCuisineIngredientRouter } from './cuisineIngredient';
export { router as staffCuisineSupplierRouter } from './cuisineSupplier';
export { router as staffEquipmentRouter } from './equipment';
export { router as staffIngredientRouter } from './ingredient';
export { router as staffRecipeRouter } from './recipe';
export { router as staffSupplierRouter } from './supplier';

export const router = Router();

router.use('/auth', staffAuthRouter);
router.use('/cusine-equipment', staffCuisineEquipmentRouter);
router.use('/cusine-ingredient', staffCuisineIngredientRouter);
router.use('/cusine-supplier', staffCuisineSupplierRouter);
router.use('/equipment', staffEquipmentRouter);
router.use('/ingredient', staffIngredientRouter);
router.use('/recipe', staffRecipeRouter);
router.use('/supplier', staffSupplierRouter);