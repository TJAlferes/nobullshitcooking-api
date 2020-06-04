import { Request, Response } from 'express';
//const crypto = require('crypto');
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  emailConfirmationCode
} from '../../lib/services/email-confirmation-code';
import {
  validRegisterRequest,
  validRegister,
  validUserEntity,
  validVerifyRequest,
  validVerify,
  validResend,
  validLoginRequest,
  validLogin
} from '../../lib/validations/user/index';
import { User } from '../../mysql-access/User';

const SALT_ROUNDS = 10;

export const userAuthController = {
  register: async function(req: Request, res: Response) {
    const email = req.body.userInfo.email;
    const pass = req.body.userInfo.password;
    const username = req.body.userInfo.username;

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

  verify: async function(req: Request, res: Response) {
    const email = req.body.userInfo.email;
    const pass = req.body.userInfo.password;
    const confirmationCode = req.body.userInfo.confirmationCode;

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

  resendConfirmationCode: async function (req: Request, res: Response) {
    const email = req.body.userInfo.email;
    const pass = req.body.userInfo.password;

    validLoginRequest({email, pass});

    const user = new User(pool);

    const { valid, feedback } = await validResend({email, pass}, user);

    if (!valid) return res.send({message: feedback});

    const confirmationCode = uuidv4();  // use JWT instead?

    emailConfirmationCode(email, confirmationCode);

    res.send({message: 'Confirmation code re-sent.'});
  },

  login: async function(req: Request, res: Response) {
    const email = req.body.userInfo.email;
    const pass = req.body.userInfo.password;

    validLoginRequest({email, pass});

    const user = new User(pool);

    const {
      valid,
      feedback,
      userExists
    } = await validLogin(bcrypt, user, {email, pass});

    if (!valid) return res.send({message: feedback});

    req.session!.userInfo = {};
    req.session!.userInfo.userId = userExists.user_id;
    req.session!.userInfo.username = userExists.username;
    req.session!.userInfo.avatar = userExists.avatar;

    return res.json({
      message: 'Signed in.',
      username: userExists.username,
      avatar: userExists.avatar
    });
  },

  logout: async function(req: Request, res: Response) {
    req.session!.destroy(function() {});
    res.end();
  },

  setAvatar: async function(req: Request, res: Response) {
    const avatar = req.body.avatar;
    const userId = req.session!.userInfo.userId;

    const user = new User(pool);

    await user.setAvatar(avatar, userId);
    
    res.send({message: 'Avatar set.'});
  },

  updateUsername: async function(req: Request, res: Response) {
    // TO DO: implement this! write a test first!
    // use res.status().json(); instead of res.send(); ?
  },

  updateEmail: async function(req: Request, res: Response) {
    // TO DO: implement this! write a test first!
  },

  updatePassword: async function(req: Request, res: Response) {
    // TO DO: implement this! write a test first!
  },

  deleteAccount: async function(req: Request, res: Response) {
    // TO DO: implement this! write a test first!
  }
};