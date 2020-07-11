import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
//import crypto from 'crypto';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { validLoginRequest } from '../../lib/validations/staff/loginRequest';
import {
  validRegisterRequest
} from '../../lib/validations/staff/registerRequest';
import { validStaffEntity } from '../../lib/validations/staff/staffEntity';
import { Staff } from '../../mysql-access/Staff';

const SALT_ROUNDS = 10;

export const staffAuthController = {
  register: async function(req: Request, res: Response) {
    const email = req.body.staffInfo.email;
    const pass = req.body.staffInfo.password;
    const staffname = req.body.staffInfo.staffname;

    assert({email, pass, staffname}, validRegisterRequest);

    if (staffname.length < 6) {
      return res.send({message: 'Staffname must be at least 6 characters.'});
    }

    if (staffname.length > 20) {
      return res.send({
        message: 'Staffname must be no more than 20 characters.'
      });
    }

    // Problem: This invalidates some older/alternative email types. Remove?
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return res.send({message: 'Invalid email.'});
    }

    if (pass.length < 6) {
      return res.send({message: 'Password must be at least 6 characters.'});
    }
    
    if (pass.length > 54) {
      return res.send({
        message: 'Password must be no more than 54 characters.'
      });
    }

    const staff = new Staff(pool);

    const [ staffExists ] = await staff.getStaffByName(staffname);

    if (staffExists) {
      return res.send({message: 'Staffname already taken.'});
    }

    const [ emailExists ] = await staff.getStaffByEmail(email);

    if (emailExists) {
      return res.send({message: 'Email already in use.'});
    }

    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

    const staffToCreate = {
      email,
      pass: encryptedPassword,
      staffname
    };

    assert(staffToCreate, validStaffEntity);

    await staff.createStaff(staffToCreate);

    return res.send({message: 'Staff account created.'});
  },
  login: async function(req: Request, res: Response) {
    const email = req.body.staffInfo.email;
    const pass = req.body.staffInfo.password;

    assert({email, pass}, validLoginRequest);

    // Problem: This invalidates some older/alternative email types. Remove?
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return res.send({message: 'Invalid email.'});
    }

    if (pass.length < 6) return res.send({message: 'Invalid password.'});

    if (pass.length > 54) return res.send({message: 'Invalid password.'});

    const staff = new Staff(pool);

    const [ staffExists ] = await staff.getStaffByEmail(email);

    if (!staffExists) {
      return res.send({message: 'Incorrect email or password.'});
    }

    //crypto.timingSafeEqual

    const isCorrectPassword = await bcrypt.compare(pass, staffExists.pass);

    if (isCorrectPassword) {
      return res.send({message: 'Incorrect email or password.'});
    }

    req.session!.staffInfo = {};
    req.session!.staffInfo.staffId = staffExists.staff_id;
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