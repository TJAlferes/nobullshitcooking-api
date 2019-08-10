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
  register: async function(req, res) {
    const email = req.sanitize(req.body.userInfo.email);
    const pass = req.sanitize(req.body.userInfo.password);
    const username = req.sanitize(req.body.userInfo.username);

    validRegisterRequest({email, pass, username});

    if (username.length < 6) {
      return res.send({message: 'Username must be at least 6 characters.'});
    }
    if (username.length > 20) {
      return res.send({message: 'Username must be no more than 20 characters.'});
    }
    // Problem: This would invalidate some older/alternative email types. Remove?
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return res.send({message: 'Invalid email.'});
    }
    if (pass.length < 6) {
      return res.send({message: 'Password must be at least 6 characters.'});
    }
    if (pass.length > 54) {
      return res.send({message: 'Password must be no more than 54 characters.'});
    }

    const user = new User(pool);

    const userExists = await user.getUserByName(username);
    if (userExists.length) return res.send({message: 'Username already taken.'});

    const emailExists = await user.getUserByEmail(email);
    if (emailExists.length) return res.send({message: 'Email already in use.'});

    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
    //const confirmationCode = uuidv4();
    const userToCreate = validUserEntity({email, pass: encryptedPassword, username});
    await user.createUser(userToCreate);

    res.send({message: 'User account created.'});
  },

  /*verify: async function(req, res) {
    const email = req.sanitize(req.body.userInfo.email);
    const pass = req.sanitize(req.body.userInfo.password);
    const confirmationCode = req.sanitize(req.body.userInfo.confirmationCode);

    validVerifyRequest({email, pass, confirmationCode});

    const user = new User(pool);

    const emailExists = await user.getUserByEmail(email);
    if (!emailExists.length) {
      return res.send('An issue occurred, please double check your info and try again.');
    }

    const temporaryCode = await user.getTemporaryConfirmationCode(email);
    if (temporaryCode[0].confirmation_code !== confirmationCode) {
      return res.send('An issue occurred, please double check your info and try again.');
    }

    res.send('User account verified.');
  },*/

  login: async function(req, res) {
    const email = req.sanitize(req.body.userInfo.email);
    const pass = req.sanitize(req.body.userInfo.password);

    validLoginRequest({email, pass});

    // Problem: This would invalidate some older/alternative email types. Remove?
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return res.send({message: 'Invalid email.'});
    }
    if (pass.length < 6) return res.send({message: 'Invalid password.'});
    if (pass.length > 54) return res.send({message: 'Invalid password.'});

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

        return res.json({message: 'Signed in.', username, avatar});
      }
    }
    
    res.send({message: 'Incorrect email or password.'});
  },

  logout: async function(req, res) {
    await req.session.destroy();
    res.end();
  }
};

module.exports = userAuthController;