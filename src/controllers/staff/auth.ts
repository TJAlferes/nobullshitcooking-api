import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import {
  validLogin,
  validLoginRequest,
  validRegister,
  validRegisterRequest,
  validStaffCreation
} from '../../lib/validations/staff/index';
import { Staff } from '../../mysql-access/Staff';

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
    const { email, password: pass, staffname } = req.body.staffInfo;
    assert({email, pass, staffname}, validRegisterRequest);
    const staff = new Staff(this.pool);
    const { valid, feedback } =
      await validRegister({email, pass, staffname}, staff);
    if (!valid) return res.send({message: feedback});
    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
    const staffCreation = {email, pass: encryptedPassword, staffname};
    assert(staffCreation, validStaffCreation);
    await staff.create(staffCreation);
    return res.send({message: 'Staff account created.'});
  }

  async login(req: Request, res: Response) {
    const { email, password: pass } = req.body.staffInfo;
    assert({email, pass}, validLoginRequest);
    const staff = new Staff(this.pool);
    const { valid, feedback, staffExists } =
      await validLogin({email, pass}, staff);
    if (!valid || !staffExists) return res.send({message: feedback});
    req.session!.staffInfo = {};
    req.session!.staffInfo.id = staffExists.id;
    req.session!.staffInfo.staffname = staffExists.staffname;
    req.session!.staffInfo.avatar = staffExists.avatar;
    return res.json({
      message: 'Signed in.',
      staffname: staffExists.staffname,
      avatar: staffExists.avatar
    });
  }

  async logout(req: Request, res: Response) {
    req.session!.destroy(function() {});
    return res.end();
  }

  /*async updateStaff(req: Request, res: Response) {
    // finish
  }*/

  /*async deleteStaff(req: Request, res: Response) {
    // finish
  }*/
}