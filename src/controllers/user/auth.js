const bcrypt = require('bcrypt');

const pool = require('../../data-access/dbPoolConnection');
const User = require('../../data-access/user/User');
const validLoginRequest = require('../../lib/validations/user/loginRequest');
const validRegisterRequest = require('../../lib/validations/user/registerRequest');
const validUserEntity = require('../../lib/validations/user/userEntity');

const SALT_ROUNDS = 10;

const userAuthController = {
  register: async function(req, res, next) {
    try {
      const email = req.sanitize(req.body.userInfo.email);
      const pass = req.sanitize(req.body.userInfo.pass);
      const username = req.sanitize(req.body.userInfo.username);
      validRegisterRequest({email, pass, username});

      // to do: return if already logged in

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

      const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
      const userToCreate = validUserEntity({email, pass: encryptedPassword, username});
      await user.createUser(userToCreate);

      res.send('user account created');
      next();
    } catch(err) {
      next(err);
    }
  },
  login: async function(req, res, next) {
    try {
      const email = req.sanitize(req.body.userInfo.email);
      const pass = req.sanitize(req.body.userInfo.pass);
      validLoginRequest({email, pass});

      const user = new User(pool);

      const userExists = await user.getUserByEmail(email);
      //if (userExists[0].email === email)
      if (userExists) {
        const isCorrectPassword = await bcrypt.compare(pass, userExists[0].pass);
        if (isCorrectPassword) {
          const userId = userExists[0].user_id;
          const username = userExists[0].username;
          const avatar = userExists[0].avatar;
          req.session.userId = userId;
          return res.json({username, avatar});
          //next(); ?  // if/else in here?
        }
        //return res.send('incorrect email or password');
      }

      res.end();  // ?  //return res.send('incorrect email or password');
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