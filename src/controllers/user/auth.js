const bcrypt = require('bcrypt');

const pool = require('../../data-access/dbPoolConnection');
const User = require('../../data-access/user/User');
const validator = require('../../lib/validations/user');

const SALT_ROUNDS = 10;
const DEFAULT_PLAN = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
  15: [],
  16: [],
  17: [],
  18: [],
  19: [],
  20: [],
  21: [],
  22: [],
  23: [],
  24: [],
  25: [],
  26: [],
  27: [],
  28: []
};

const userAuthController = {
  register: async function(req, res, next) {
    try {
      const email = req.body.userInfo.email;
      const password = req.body.userInfo.password;
      const username = req.body.userInfo.username;
      //validator.validate(userInfo);  // implement control flow here
      // return if already logged in
      const user = new User(pool);
      const emailExists = await user.getUserByEmail(email);
      if (emailExists !== []) {
        res.send('email already in use... lost your password?');
        next();
      }
      const userExists = await user.getUserByName(username);
      if (userExists !== []) {
        res.send('username already taken');
        next();
      }
      const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await user.createUser({email, password: encryptedPassword, username, avatar: '', plan: DEFAULT_PLAN});
      res.send('be yay');
      next();
    } catch(err) {
      next(err);
    }
  },
  login: async function(req, res, next) {
    try {
      const email = req.body.userInfo.email;
      const password = req.body.userInfo.password;
      //validator.validate(userInfo);  // implement control flow here
      const user = new User(pool);
      const userExists = await user.getUserByEmail(email);
      if (userExists[0].email === email) {
        const isCorrectPassword = await bcrypt.compare(password, userExists[0].pass);
        if (isCorrectPassword) {
          const userId = userExists[0].user_id;
          req.session.userId = userId;
          const userData = await user.viewUserById(userId);
          const username = userData[0].username;
          const avatar = userData[0].avatar;
          return res.json({username, avatar});
        }
        return res.send('incorrect email or password')
      }
      res.end();
      next();
    } catch(err) {
      next(err);
    }
  },
  logout: async function(req, res, next) {
    try {
      await req.session.destroy(err => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.end();  //res.json({});  ??? res.redirect('/home')?
      });
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userAuthController;