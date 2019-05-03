const bcrypt = require('bcrypt');  // or bcryptjs?

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
};  // move me

const userAuthController = {
  register: async function(req, res) {
    const email = req.body.userInfo.email;
    const password = req.body.userInfo.password;
    const username = req.body.userInfo.username;
    //validator.validate(userInfo);  // implement control flow here
    const user = new User(pool);
    const emailExists = await user.getUserByEmail(email);
    if (emailExists === []) return res.send('email already in use... lost your password?');
    const userExists = await user.getUserByName(username);
    if (userExists === []) return res.send('username already taken');
    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await user.createUser({email, password: encryptedPassword, username, avatar: '', plan: DEFAULT_PLAN});
    res.send('be yay');
  },
  login: async function(req, res) {
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
  },
  logout: async function(req, res) {
    try {
      //console.log(req.sessionID);
      //console.log(req.headers.cookie);
      await req.session.destroy(err => {
        console.log('here1');
        if (err) return next(err);
        console.log('here2');
        res.clearCookie('connect.sid');
        console.log('here3');
        //res.end();  //res.json({});  ??? res.redirect('/home')?
        //res.send('logged out');
        // not perfect yet, sometimes not finding file...
      });
    } catch (err) {
      console.log('here4err');
      console.log(err);
    }
  }
};

module.exports = userAuthController;