const { Router } = require('express');

const userAuthRouter = require('./auth');
const userDashboardRouter = require('./dashboard');
const userPlanRouter = require('./plan');
const userEquipmentRouter = require('./equipment');
const userIngredientRouter = require('./ingredient');
const userRecipeRouter = require('./recipe');

const router = Router();

router.use('/auth', userAuthRouter);
router.use('/dashboard', userDashboardRouter);
router.use('/plan', userPlanRouter);
router.use('/equipment', userEquipmentRouter);
router.use('/ingredient', userIngredientRouter);
router.use('/recipe', userRecipeRouter);

module.exports = router;