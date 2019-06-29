const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const sgMail = require('@sendgrid/mail');
//const nodemailer = require('nodemailer');

const pool = require('../../data-access/dbPoolConnection');
const User = require('../../data-access/user/User');
const validLoginRequest = require('../../lib/validations/user/loginRequest');
const validRegisterRequest = require('../../lib/validations/user/registerRequest');
const validVerifyRequest = require('../../lib/validations/user/verifyRequest');
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
      const confirmationCode = uuidv4();
      const userToCreate = validUserEntity({email, pass: encryptedPassword, username, confirmationCode});
      await user.createUser(userToCreate);

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: 'test@example.com',
        from: 'test@example.com',
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg);
      /*const smtpTransport = nodemailer.createTransport({
        service: 
      });
      smtpTransport.sendMail({
        from: "No Bullshit Cooking <accounts@nobullshitcooking.com>",
        to: `${email}`,
        subject: "Confirmation Code",
        html: `${confirmationCode}`
      }, (err, info) => {
        err ? console.log(err) : console.log(info);
      });*/

      res.send('user account created');
      next();
    } catch(err) {
      next(err);
    }
  },
  verify: async function(req, res, next) {
    try {
      const email = req.sanitize(req.body.userInfo.email);
      const pass = req.sanitize(req.body.userInfo.pass);
      const confirmationCode = req.sanitize(req.body.userInfo.confirmationCode);
      validVerifyRequest({email, pass, confirmationCode});

      const user = new User(pool);

      const emailExists = await user.getUserByEmail(email);
      if (emailExists !== []) {
        res.send('an issue occurred, please double check your info and try again');
        next();
      }

      const temporaryCode = await user.getTemporaryConfirmationCode(email);
      if (temporaryCode[0].confirmation_code !== confirmationCode) {
        res.send('an issue occurred, please double check your info and try again');
        next();
      }

      res.send('user account verified');
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
          req.session.userInfo.userId = userId;
          res.json({username, avatar});
          next();
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