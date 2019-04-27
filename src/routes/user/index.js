const { Router } = require('express');

const userAuthRouter = require('./auth');
const userDashboardRouter = require('./dashboard');
const userPlanRouter = require('./plan');
const userRecipeRouter = require('./recipe');

const router = Router();

router.use('/auth', userAuthRouter);
router.use('/dashboard', userDashboardRouter);
router.use('/plan', userPlanRouter);
router.use('/recipe', userRecipeRouter);

module.exports = router;