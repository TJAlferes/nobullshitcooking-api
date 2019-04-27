const bcrypt = require('bcrypt');  // or bcryptjs?

const pool = require('../../data-access/dbPoolConnection');
const User = require('../../data-access/user/User');
const validator = require('../../lib/validations/user');

const SALT_ROUNDS = 10;

const userAuthController = {
  register: async function(req, res) {
    const userInfo = req.body.userInfo;
    validator.validate(userInfo);  // implement control flow here
    const { username, password } = userInfo;
    const user = new User(pool);
    const userExists = await user.getUserByName({username});
    if (userExists) return res.send('username already taken');
    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await user.createUser({username, password: encryptedPassword});
    res.redirect('/user/login');
  },
  login: async function(req, res) {
    const userInfo = req.body.userInfo;
    validator.validate(userInfo);  // implement control flow here
    const { username, password } = userInfo;
    const user = new User(pool);
    const userExists = await user.getUserByName({username});
    if (userExists) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (isCorrectPassword) {
        req.session.userId = user.user_id;
        return res.redirect('/user/dashboard');
      }
    }
    res.redirect('/401');
  },
  logout: async function(req, res) {
    await req.session.destroy();
    res.end();  // ??? redirect?
  }
};

module.exports = userAuthController;