//const crypto = require('crypto');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const User = require('../../mysql-access/User');

const pool = require('../../lib/connections/mysqlPoolConnection');

const emailConfirmationCode = require('../../lib/services/email-confirmation-code');

const {
  validRegisterRequest,
  validRegister,
  validUserEntity,
  validVerifyRequest,
  validVerify,
  validResend,
  validLoginRequest,
  validLogin
} = require('../../lib/validations/user/index');

const SALT_ROUNDS = 10;

const userAuthController = {
  register: async function(req, res) {
    const email = req.sanitize(req.body.userInfo.email);
    const pass = req.sanitize(req.body.userInfo.password);
    const username = req.sanitize(req.body.userInfo.username);

    validRegisterRequest({email, pass, username});  // TypeScript?

    const user = new User(pool);

    const {
      valid,
      feedback
    } = await validRegister({email, pass, username}, user);

    if (!valid) return res.send({message: feedback});

    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

    const confirmationCode = uuidv4();  // JWT?

    const userToCreate = validUserEntity({
      email,
      pass: encryptedPassword,
      username,
      confirmationCode
    });

    await user.createUser(userToCreate);

    emailConfirmationCode(email, confirmationCode);

    res.send({message: 'User account created.'});
  },

  verify: async function(req, res) {
    const email = req.sanitize(req.body.userInfo.email);
    const pass = req.sanitize(req.body.userInfo.password);
    const confirmationCode = req.sanitize(req.body.userInfo.confirmationCode);

    validVerifyRequest({email, pass, confirmationCode});

    const user = new User(pool);

    const {
      valid,
      feedback
    } = await validVerify({email, confirmationCode}, user);

    if (!valid) return res.send({message: feedback});

    //user.verifyUser(email);  // change from uuid to null

    res.send('User account verified.');
  },

  resendConfirmationCode: async function (req, res) {
    const email = req.sanitize(req.body.userInfo.email);
    const pass = req.sanitize(req.body.userInfo.password);

    validLoginRequest({email, pass});

    const user = new User(pool);

    const { valid, feedback } = await validResend({email, pass}, user);

    if (!valid) return res.send({message: feedback});

    const confirmationCode = uuidv4();  // use JWT instead?

    emailConfirmationCode(email, confirmationCode);

    res.send({message: 'Confirmation code re-sent.'});
  },

  login: async function(req, res) {
    const email = req.sanitize(req.body.userInfo.email);
    const pass = req.sanitize(req.body.userInfo.password);

    validLoginRequest({email, pass});

    const user = new User(pool);

    const { valid, feedback } = await validLogin({email, pass}, user);

    if (!valid) return res.send({message: feedback});

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

  setAvatar: async function(req, res) {
    const avatar = req.sanitize(req.body.avatar);
    const userId = req.session.userInfo.userId;
    const user = new User(pool);
    await user.setAvatar(avatar, userId);
    res.send({message: 'Avatar set.'});
  },

  updateUsername: async function(req, res) {
    // TO DO: implement this! write a test first!
    // use res.status().json(); instead of res.send(); ?
  },

  updateEmail: async function(req, res) {
    // TO DO: implement this! write a test first!
  },

  updatePassword: async function(req, res) {
    // TO DO: implement this! write a test first!
  },

  deleteAccount: async function(req, res) {
    // TO DO: implement this! write a test first!
  }
};

module.exports = userAuthController;