const { Router } = require('express');

const staffAuthRouter = require('./auth');
const staffDashboardRouter = require('./dashboard');
const staffPlanRouter = require('./plan');
const staffEquipmentRouter = require('./equipment');
const staffIngredientRouter = require('./ingredient');
const staffRecipeRouter = require('./recipe');

const router = Router();

router.use('/auth', staffAuthRouter);
router.use('/dashboard', staffDashboardRouter);
router.use('/plan', staffPlanRouter);
router.use('/equipment', staffEquipmentRouter);
router.use('/ingredient', staffIngredientRouter);
router.use('/recipe', staffRecipeRouter);

module.exports = router;