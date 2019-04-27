const { Router } = require('express');

const staffAuthRouter = require('./auth');
const staffDashboardRouter = require('./dashboard');
const staffPlanRouter = require('./plan');
const staffRecipeRouter = require('./recipe');

const router = Router();

router.use('/auth', staffAuthRouter);
router.use('/dashboard', staffDashboardRouter);
router.use('/plan', staffPlanRouter);
router.use('/recipe', staffRecipeRouter);

module.exports = router;