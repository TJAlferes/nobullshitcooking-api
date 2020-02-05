//const crypto = require('crypto');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const pool = require('../../lib/connections/mysqlPoolConnection');
const User = require('../../mysql-access/User');
const emailConfirmationCode = require('../../lib/services/email-confirmation-code');
const validLoginRequest = require('../../lib/validations/user/loginRequest');
const validRegisterRequest = require('../../lib/validations/user/registerRequest');
const validVerifyRequest = require('../../lib/validations/user/verifyRequest');
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
    const confirmationCode = uuidv4();  // use JWT instead?

    const userToCreate = validUserEntity({
      email,
      pass: encryptedPassword,
      username,
      confirmationCode
    });

    await user.createUser(userToCreate);

    emailConfirmationCode(email);

    res.send({message: 'User account created.'});
  },

  verify: async function(req, res) {
    const email = req.sanitize(req.body.userInfo.email);
    const pass = req.sanitize(req.body.userInfo.password);
    const confirmationCode = req.sanitize(req.body.userInfo.confirmationCode);

    validVerifyRequest({email, pass, confirmationCode});

    const user = new User(pool);

    const emailExists = await user.getUserByEmail(email);
    if (!emailExists.length) {
      return res.send({
        message: 'An issue occurred, please double check your info and try again.'
      });
    }

    const temporaryCode = await user.getTemporaryConfirmationCode(email);
    const wrongCode = temporaryCode[0].confirmation_code !== confirmationCode
    if (wrongCode) {
      return res.send({
        message: 'An issue occurred, please double check your info and try again.'
      });
    }

    res.send('User account verified.');
  },

  login: async function(req, res) {
    const email = req.sanitize(req.body.userInfo.email);
    const pass = req.sanitize(req.body.userInfo.password);

    validLoginRequest({email, pass});

    // Problem: This would invalidate some older/alternative email types.
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return res.send({message: 'Invalid email.'});
    }
    if (pass.length < 6) return res.send({message: 'Invalid password.'});
    if (pass.length > 54) return res.send({message: 'Invalid password.'});

    const user = new User(pool);

    const userExists = await user.getUserByEmail(email);
    //if (userExists && crypto.timingSafeEqual(userExists[0].email, email))
    if (!userExists.length) {
      return res.send({message: 'Incorrect email or password.'});
    }
    if (userExists[0].email !== email) {
      return res.send({message: 'Incorrect email or password.'});
    }

    const isCorrectPassword = await bcrypt.compare(pass, userExists[0].pass);
    if (!isCorrectPassword) {
      return res.send({message: 'Incorrect email or password.'});
    }

    const notYetConfirmed = userExists[0].confirmation_code !== null;
    if (notYetConfirmed) {
      return res.send({
        message: 'Please check your email for your confirmation code.'
      });
    }

    req.session.userInfo = {};
    req.session.userInfo.userId = userExists[0].user_id;
    req.session.userInfo.username = userExists[0].username;
    req.session.userInfo.avatar = userExists[0].avatar;

    return res.json({
      message: 'Signed in.',
      username: userExists[0].username,
      avatar: userExists[0].avatar
    });
  },

  logout: async function(req, res) {
    await req.session.destroy();
    res.end();
  },

  /*changeUsername: async function(req, res) {
    // TO DO: implement this!
  }*/

  /*changePassword: async function(req, res) {
    // TO DO: implement this!
  }*/

  setAvatar: async function(req, res) {
    const avatar = req.sanitize(req.body.avatar);
    const userId = req.session.userInfo.userId;
    const user = new User(pool);
    await user.setAvatar(avatar, userId);
    res.send({message: 'Avatar set.'});
  },

  /*deleteAccount: async function(req, res) {
    // TO DO: implement this!
  }*/
};

module.exports = userAuthController;