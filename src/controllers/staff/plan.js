const pool = require('../data-access/dbPoolConnection');
const Staff = require('../../data-access/staff/Staff');

const staffPlanController = {
  viewPlan: async function(req, res) {
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
    } catch (err) {
      console.log(err);  // res the error, safely
    }
  },
  updatePlan: async function(req, res) {
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
    } catch (err) {
      console.log(err);  // res the error, safely
    }
  }
};

module.exports = staffPlanController;