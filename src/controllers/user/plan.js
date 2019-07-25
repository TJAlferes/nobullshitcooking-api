const pool = require('../../lib/connections/mysqlPoolConnection');
const Plan = require('../../mysql-access/Plan');
const validPlanEntity = require('../../lib/validations/plan/planEntity');

const userPlanController = {
  viewAllMyPrivatePlans: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const plan = new Plan(pool);
      const myPlans = await plan.viewAllMyPrivatePlans(userId);
      res.send(myPlans);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewMyPrivatePlan: async function(req, res, next) {
    try {
      const planName = req.sanitize(req.body.planName);
      const userId = req.session.userInfo.userId;
      const plan = new Plan(pool);
      const [ myPlan ] = await plan.viewMyPrivatePlan(userId, planName);
      res.send(myPlan);
      next();
    } catch(err) {
      next(err);
    }
  },
  createMyPrivatePlan: async function(req, res, next) {
    try {
      const planName = req.sanitize(req.body.planInfo.planName);
      const planData = req.sanitize(req.body.planInfo.planData);
      const userId = req.session.userInfo.userId;
      const planToCreate = validPlanEntity({
        authorId: userId,
        ownerId: userId,
        planName,
        planData
      });
      const plan = new Plan(pool);
      await plan.createMyPrivatePlan(planToCreate);
      res.send('Plan created.');
      next();
    } catch(err) {
      next(err);
    }
  },
  updateMyPrivatePlan: async function(req, res, next) {
    try {
      const planId = req.sanitize(req.body.planInfo.oldPlanName);
      const planName = req.sanitize(req.body.planInfo.planName);
      const planData = req.sanitize(req.body.planInfo.planData);
      const userId = req.session.userInfo.userId;
      const planToUpdateWith = validPlanEntity({
        authorId: userId,
        ownerId: userId,
        planName,
        planData
      });
      const plan = new Plan(pool);
      await plan.updateMyPrivatePlan(planToUpdateWith, planId);
      res.send('Plan updated.');
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteMyPrivatePlan: async function(req, res, next) {
    try {
      const planName = req.sanitize(req.body.planInfo.planName);
      const userId = req.session.userInfo.userId;
      const plan = new Plan(pool);
      await plan.deleteMyPrivatePlan(userId, planName);
      res.send('Plan deleted.');
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userPlanController;