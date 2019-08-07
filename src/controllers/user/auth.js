//const crypto = require('crypto');
const bcrypt = require('bcrypt');
//const uuidv4 = require('uuid/v4');
//const sgMail = require('@sendgrid/mail');

const pool = require('../../lib/connections/mysqlPoolConnection');
const User = require('../../mysql-access/User');
const validLoginRequest = require('../../lib/validations/user/loginRequest');
const validRegisterRequest = require('../../lib/validations/user/registerRequest');
//const validVerifyRequest = require('../../lib/validations/user/verifyRequest');
const validUserEntity = require('../../lib/validations/user/userEntity');

const SALT_ROUNDS = 10;

const userAuthController = {
  register: async function(req, res, next) {
    try {
      const email = req.sanitize(req.body.userInfo.email);
      const pass = req.sanitize(req.body.userInfo.password);
      const username = req.sanitize(req.body.userInfo.username);
      validRegisterRequest({email, pass, username});

      // to do: return if already logged in
      
      const user = new User(pool);

      const userExists = await user.getUserByName(username);
      if (userExists !== []) {
        res.send({message: 'Username already taken.'});
        return next();
      }

      const emailExists = await user.getUserByEmail(email);
      console.log(emailExists);
      if (emailExists !== []) {
        res.send({message: 'Email already in use.'});
        return next();
      }

      const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
      //const confirmationCode = uuidv4();
      const userToCreate = validUserEntity({email, pass: encryptedPassword, username});
      await user.createUser(userToCreate);

      res.send({message: 'User account created.'});
      next();
    } catch(err) {
      next(err);
    }
  },
  /*verify: async function(req, res, next) {
    try {
      const email = req.sanitize(req.body.userInfo.email);
      const pass = req.sanitize(req.body.userInfo.password);
      const confirmationCode = req.sanitize(req.body.userInfo.confirmationCode);
      validVerifyRequest({email, pass, confirmationCode});

      const user = new User(pool);

      const emailExists = await user.getUserByEmail(email);
      if (emailExists !== []) {
        res.send('An issue occurred, please double check your info and try again.');
        next();
      }

      const temporaryCode = await user.getTemporaryConfirmationCode(email);
      if (temporaryCode[0].confirmation_code !== confirmationCode) {
        res.send('An issue occurred, please double check your info and try again.');
        next();
      }

      res.send('User account verified.');
      next();
    } catch(err) {
      next(err);
    }
  },*/
  login: async function(req, res, next) {
    try {
      const email = req.sanitize(req.body.userInfo.email);
      const pass = req.sanitize(req.body.userInfo.password);
      validLoginRequest({email, pass});
      const user = new User(pool);
      const userExists = await user.getUserByEmail(email);
      //if (userExists && crypto.timingSafeEqual(userExists[0].email, email)) {
      if (userExists && userExists[0].email == email) {
        const isCorrectPassword = await bcrypt.compare(pass, userExists[0].pass);
        if (isCorrectPassword) {
          const userId = userExists[0].user_id;
          const username = userExists[0].username;
          const avatar = userExists[0].avatar;
          req.session.userInfo = {};
          req.session.userInfo.userId = userId;
          req.session.userInfo.username = username;
          res.json({message: 'Signed in.', username, avatar});
          return next();
        }
      }
      res.send({message: 'Incorrect email or password.'});
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
        res.send({message: 'Signed out.'});
      });
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userAuthController;