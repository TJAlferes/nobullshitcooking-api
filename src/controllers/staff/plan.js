const pool = require('../../data-access/dbPoolConnection');
const Staff = require('../../data-access/staff/Staff');

const staffPlanController = {
  viewPlan: async function(req, res, next) {
    try {
      //const staffInfo = req.body.staffInfo;
      //validator.validate(staffInfo);  // implement control flow here
      const { staffname } = staffInfo;
      const staff = new Staff(pool);
      const staffExists = await staff.getStaffByName({staffname});
      if (staffExists) {
        const [ plan ] = await staff.viewPlan(staffId);
        res.send(plan);
      }
      next();
    } catch (err) {
      next(err);
    }
  },
  updatePlan: async function(req, res, next) {
    try {
      //const staffInfo = req.body.staffInfo;
      //validator.validate(staffInfo);  // implement control flow here
      const { staffname } = staffInfo;
      const staff = new Staff(pool);
      const staffExists = await staff.getStaffByName({staffname});
      if (staffExists) {
        await staff.updatePlan(stuff);
        res.end();
      }
      res.end();
      next();
    } catch (err) {
      next(err);
    }
  }
};

module.exports = staffPlanController;