import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { v4 as uuidv4 } from 'uuid';

import { Staff } from '../../access/mysql';
import { emailConfirmationCode } from '../../lib/services';
import {
  validStaffRegisterRequest, validRegister,
  validResendRequest, validResend,
  validVerifyRequest, validVerify,
  validCreatingStaff, validUpdatingStaff,
  validLoginRequest, validLogin
} from '../../lib/validations';
import { io } from '../../index';

const SALT_ROUNDS = 10;

export class StaffAuthController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.register =               this.register.bind(this);
    this.verify =                 this.verify.bind(this);
    this.resendConfirmationCode = this.resendConfirmationCode.bind(this);
    this.login =                  this.login.bind(this);
    this.logout =                 this.logout.bind(this);
    this.update =                 this.update.bind(this);
    //this.delete =                 this.delete.bind(this);
  }

  async register(req: Request, res: Response) {
    const { email, pass, staffname } = req.body.staffInfo;
    assert({email, pass, staffname}, validStaffRegisterRequest);

    const staff = new Staff(this.pool);
    const feedback = await validRegister({email, pass, name: staffname}, staff);
    if (feedback !== "valid") return res.send({message: feedback});

    const encryptedPass = await bcrypt.hash(pass, SALT_ROUNDS);
    const confirmationCode = uuidv4();
    const args = {email, pass: encryptedPass, staffname, confirmationCode};
    assert(args, validCreatingStaff);

    await staff.create(args);
    emailConfirmationCode(email, confirmationCode);

    return res.send({message: 'Staff account created.'});
  }

  async verify(req: Request, res: Response) {
    const { email, pass, confirmationCode } = req.body.staffInfo;
    assert({email, pass, confirmationCode}, validVerifyRequest);

    const staff = new Staff(this.pool);
    const feedback = await validVerify({email, pass, confirmationCode}, staff);
    if (feedback !== "valid") return res.send({message: feedback});

    staff.verify(email);

    return res.send({message: 'User account verified.'});
  }

  async resendConfirmationCode(req: Request, res: Response) {
    const { email, pass } = req.body.staffInfo;
    assert({email, pass}, validResendRequest);

    const staff = new Staff(this.pool);
    const feedback = await validResend({email, pass}, staff);
    if (feedback !== "valid") return res.send({message: feedback});
    
    const confirmationCode = uuidv4();
    emailConfirmationCode(email, confirmationCode);
    
    return res.send({message: 'Confirmation code re-sent.'});
  }

  async login(req: Request, res: Response) {
    const { email, pass } = req.body.staffInfo;
    assert({email, pass}, validLoginRequest);

    const staff = new Staff(this.pool);
    const { feedback, exists } = await validLogin({email, pass}, staff);
    if (feedback !== "valid" || !exists) return res.send({message: feedback});

    const { id, staffname } = exists;
    req.session!.staffInfo = {id, staffname};
    
    return res.json({message: 'Signed in.', staffname});
  }

  async logout(req: Request, res: Response) {
    const sessionId = req.session.id;

    req.session!.destroy(function() {
      io.in(sessionId).disconnectSockets();
      res.status(204);
    });

    return res.end();
  }

  async update(req: Request, res: Response) {
    const { email, pass, staffname } = req.body.staffInfo;
    const id = req.session.staffInfo!.id;

    const encryptedPass = await bcrypt.hash(pass, SALT_ROUNDS);
    const args = {email, pass: encryptedPass, staffname};
    assert(args, validUpdatingStaff);

    const staff = new Staff(this.pool);
    await staff.update({id, ...args});

    return res.send({message: 'Account updated.'});
  }

  //async delete(req: Request, res: Response) {}
}