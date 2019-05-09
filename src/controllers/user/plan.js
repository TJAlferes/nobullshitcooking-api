const pool = require('../../data-access/dbPoolConnection');
const User = require('../../data-access/user/User');

// TO DO: FIX/FINISH THIS

const userPlanController = {
  viewPlan: async function(req, res, next) {
    //const userInfo = req.body.userInfo;
    //validator.validate(userInfo);  // implement control flow here
    const { username } = userInfo;
    const user = new User(pool);
    const userExists = await user.getuserByName({username});
    if (userExists) {
      const [ plan ] = await user.viewPlan(userId);
      res.send(plan);
    }
  },
  updatePlan: async function(req, res, next) {
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
  }
};

module.exports = userPlanController;