import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Staff } from '../../access/mysql';
import {
  validLogin,
  validLoginRequest,
  validRegister,
  validRegisterRequest,
  validStaffCreation  // validCreatingStaff validUpdatingStaff
} from '../../lib/validations/staff';

const SALT_ROUNDS = 10;

export class StaffAuthController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    //this.update = this.update.bind(this);
    //this.delete = this.delete.bind(this);
  }

  async register(req: Request, res: Response) {
    const { email, pass, staffname } = req.body.staffInfo;
    assert({email, pass, staffname}, validRegisterRequest);

    const staff = new Staff(this.pool);
    const feedback = await validRegister({email, pass, staffname}, staff);
    if (feedback !== "valid") return res.send({message: feedback});

    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
    const args = {email, pass: encryptedPassword, staffname};
    assert(args, validStaffCreation);
    await staff.create(args);
    return res.send({message: 'Staff account created.'});
  }

  async login(req: Request, res: Response) {
    const { email, pass } = req.body.staffInfo;
    assert({email, pass}, validLoginRequest);

    const staff = new Staff(this.pool);
    const { feedback, staffExists } = await validLogin({email, pass}, staff);
    if (feedback !== "valid" || !staffExists) {
      return res.send({message: feedback});
    }

    const { id, staffname } = staffExists;
    req.session!.staffInfo = {id, staffname};
    return res.json({message: 'Signed in.', staffname});
  }

  async logout(req: Request, res: Response) {
    req.session!.destroy(function() {});
    return res.end();
  }

  async update(req: Request, res: Response) {
    // TO DO: finish
    const { email, pass, staffname } = req.body.staffInfo;
    const id = req.session.staffInfo!.id;
    const args = {email, pass, staffname};
    //assert(args, validStaffUpdate);

    const staff = new Staff(this.pool);
    await staff.update({id, ...args});
    // should it send the updated values back? const [ updatedStaff ] = await
    return res.send({message: 'Account updated.'});
  }

  /*async delete(req: Request, res: Response) {
    // TO DO: finish
  }*/
}