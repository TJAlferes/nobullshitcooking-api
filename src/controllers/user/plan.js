const pool = require('../../lib/connections/mysqlPoolConnection');
const Plan = require('../../mysql-access/Plan');
const validPlanEntity = require('../../lib/validations/plan/planEntity');

const userPlanController = {
  viewAllMyPrivatePlans: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const plan = new Plan(pool);
      const plans  = await plan.viewAllMyPrivatePlans(userId);
      res.send(plans);
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
      const [ plan ] = await plan.viewMyPrivatePlan(userId, planName);
      res.send(plan);
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
      const oldPlanName = req.sanitize(req.body.planInfo.oldPlanName)
      const updatedPlanName = req.sanitize(req.body.planInfo.updatedPlanName);
      const updatedPlanData = req.sanitize(req.body.planInfo.updatedPlanData);
      const userId = req.session.userInfo.userId;
      validPlanEntity({
        authorId: userId,
        ownerId: userId,
        planName: updatedPlanName,
        planData: updatedPlanData
      });
      const plan = new Plan(pool);
      await plan.updateMyPrivatePlan(updatedPlanName, updatedPlanData, userId, oldPlanName);
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