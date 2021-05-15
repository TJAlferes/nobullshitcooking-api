import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../../access/mysql';
import {
  emailConfirmationCode
} from '../../lib/services/email-confirmation-code';
import {
  validLogin,
  validLoginRequest,
  validRegister,
  validRegisterRequest,
  validResend,
  validUserCreation,
  validUserUpdate,
  validVerify,
  validVerifyRequest
} from '../../lib/validations/user';

const SALT_ROUNDS = 10;

export class UserAuthController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.register = this.register.bind(this);
    this.verify = this.verify.bind(this);
    this.resendConfirmationCode = this.resendConfirmationCode.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async register(req: Request, res: Response) {
    const { email, password: pass, username } = req.body.userInfo;

    assert({email, pass, username}, validRegisterRequest);

    // why here? why not in the service/validation?

    const user = new User(this.pool);

    const { valid, feedback } =
      await validRegister({email, pass, username}, user);
    
    if (!valid) return res.send({message: feedback});

    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

    const confirmationCode = uuidv4();

    const userToCreate = {
      email,
      pass: encryptedPassword,
      username,
      confirmationCode
    };

    assert(userToCreate, validUserCreation);

    await user.create(userToCreate);

    emailConfirmationCode(email, confirmationCode);
    
    return res.send({message: 'User account created.'});
  }

  async verify(req: Request, res: Response) {
    const { email, password: pass, confirmationCode } = req.body.userInfo;

    assert({email, pass, confirmationCode}, validVerifyRequest);

    const user = new User(this.pool);

    const isValidVerify =
      await validVerify({email, pass, confirmationCode}, user);

    if (!isValidVerify.valid) {
      return res.send({message: isValidVerify.feedback});
    }

    user.verify(email);

    return res.send({message: 'User account verified.'});
  }

  async resendConfirmationCode(req: Request, res: Response) {
    const { email, password: pass } = req.body.userInfo;

    assert({email, pass}, validLoginRequest);

    const user = new User(this.pool);

    const { valid, feedback } = await validResend({email, pass}, user);

    if (!valid) return res.send({message: feedback});

    const confirmationCode = uuidv4();

    emailConfirmationCode(email, confirmationCode);

    return res.send({message: 'Confirmation code re-sent.'});
  }

  async login(req: Request, res: Response) {
    const { email, password: pass } = req.body.userInfo;

    assert({email, pass}, validLoginRequest);

    const user = new User(this.pool);

    const { valid, feedback, userExists } =
      await validLogin({email, pass}, user);
    
    if (!valid || !userExists) return res.send({message: feedback});

    const { username, avatar } = userExists;

    req.session!.userInfo = {};
    req.session!.userInfo.username = username;
    req.session!.userInfo.avatar = avatar;

    return res.json({message: 'Signed in.', username, avatar});
  }

  async logout(req: Request, res: Response) {
    req.session!.destroy(function() {});
    return res.end();
  }

  async update(req: Request, res: Response) {
    const { email, password: pass, username, avatar } = req.body.userInfo;

    const userToUpdateWith = {email, pass, username, avatar};

    assert(userToUpdateWith, validUserUpdate);

    const user = new User(this.pool);

    await user.update(userToUpdateWith);

    return res.send({message: 'Account updated.'});
  }

  async delete(req: Request, res: Response) {
    const username = req.session!.userInfo.username;

    const user = new User(this.pool);

    await user.delete(username);

    return res.send({message: 'Account deleted.'});
  }
}