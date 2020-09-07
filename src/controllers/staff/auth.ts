import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validLogin,
  validLoginRequest,
  validRegister,
  validRegisterRequest,
  validStaffCreation
} from '../../lib/validations/staff/index';
import { Staff } from '../../mysql-access/Staff';

const SALT_ROUNDS = 10;

export const staffAuthController = {
  register: async function(req: Request, res: Response) {
    const { email, password: pass, staffname } = req.body.staffInfo;

    assert({email, pass, staffname}, validRegisterRequest);

    const staff = new Staff(pool);

    const { valid, feedback } =
      await validRegister({email, pass, staffname}, staff);
    if (!valid) return res.send({message: feedback});

    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

    const staffCreation = {email, pass: encryptedPassword, staffname};

    assert(staffCreation, validStaffCreation);

    await staff.create(staffCreation);

    return res.send({message: 'Staff account created.'});
  },
  login: async function(req: Request, res: Response) {
    const { email, password: pass } = req.body.staffInfo;

    assert({email, pass}, validLoginRequest);

    const staff = new Staff(pool);

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
  },
  logout: async function(req: Request, res: Response) {
    req.session!.destroy(function() {});
    return res.end();
  },
  /*updateStaff: async function(req: Request, res: Response) {
    // finish
  },
  deleteStaff: async function(req: Request, res: Response) {
    // finish
  }*/
};