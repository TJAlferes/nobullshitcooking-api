const pool = require('../data-access/dbPoolConnection');
const User = require('../../data-access/user/User');

const userPlanController = {
  viewPlan: async function(req, res) {
    try {
      //const userInfo = req.body.userInfo;
      //validator.validate(userInfo);  // implement control flow here
      const { username } = userInfo;
      const user = new User(pool);
      const userExists = await user.getuserByName({username});
      if (userExists) {
        const [ plan ] = await user.viewPlan(userId);
        res.send(plan);
      }
    } catch (err) {
      console.log(err);  // res the error, safely
    }
  },
  updatePlan: async function(req, res) {
    try {
      //const userInfo = req.body.userInfo;
      //validator.validate(userInfo);  // implement control flow here
      const { username } = userInfo;
      const user = new User(pool);
      const userExists = await user.getUserByName({username});
      if (userExists) {
        await user.updatePlan(stuff);
        res.end();
      }
      res.end();
    } catch (err) {
      console.log(err);  // res the error, safely
    }
  }
};

module.exports = userPlanController;