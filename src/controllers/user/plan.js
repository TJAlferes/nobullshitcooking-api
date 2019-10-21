const pool = require('../../lib/connections/mysqlPoolConnection');
const Plan = require('../../mysql-access/Plan');
const validPlanEntity = require('../../lib/validations/plan/planEntity');

const userPlanController = {
  viewAllMyPrivatePlans: async function(req, res) {
    const ownerId = req.session.userInfo.userId;
    const plan = new Plan(pool);
    const myPlans = await plan.viewAllMyPrivatePlans(ownerId);
    res.send(myPlans);
  },
  viewMyPrivatePlan: async function(req, res) {
    const planId = Number(req.sanitize(req.body.planId));
    const ownerId = req.session.userInfo.userId;
    const plan = new Plan(pool);
    const [ myPlan ] = await plan.viewMyPrivatePlan(ownerId, planId);
    res.send(myPlan);
  },
  createMyPrivatePlan: async function(req, res) {
    const planName = req.sanitize(req.body.planInfo.planName);
    const planData = req.body.planInfo.planData;

    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;

    const planToCreate = validPlanEntity({authorId, ownerId, planName, planData});
    const plan = new Plan(pool);
    await plan.createMyPrivatePlan(planToCreate);
    res.send({message: 'Plan created.'});
  },
  updateMyPrivatePlan: async function(req, res) {
    const planId = Number(req.sanitize(req.body.planInfo.planId));
    const planName = req.sanitize(req.body.planInfo.planName);
    const planData = req.body.planInfo.planData;

    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;

    const planToUpdateWith = validPlanEntity({authorId, ownerId, planName, planData});
    const plan = new Plan(pool);
    await plan.updateMyPrivatePlan(planToUpdateWith, planId);
    res.send({message: 'Plan updated.'});
  },
  deleteMyPrivatePlan: async function(req, res) {
    const planId = Number(req.sanitize(req.body.planId));
    const ownerId = req.session.userInfo.userId;
    const plan = new Plan(pool);
    await plan.deleteMyPrivatePlan(ownerId, planId);
    res.send({message: 'Plan deleted.'});
  }
};

module.exports = userPlanController;