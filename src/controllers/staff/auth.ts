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

    const staffExists = await staff.getStaffByName(staffname);
    if (staffExists.length) {
      return res.send({message: 'Staffname already taken.'});
    }

    const emailExists = await staff.getStaffByEmail(email);
    if (emailExists.length) return res.send({message: 'Email already in use.'});

    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

    const staffToCreate = {
      email,
      pass: encryptedPassword,
      staffname
    };

    assert(staffToCreate, validStaffEntity);

    await staff.createStaff(staffToCreate);

    res.send({message: 'Staff account created.'});
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

    const staffExists = await staff.getStaffByEmail(email);
    //crypto.timingSafeEqual
    if (staffExists && staffExists[0].email == email) {
      const isCorrectPassword = await bcrypt.compare(pass, staffExists[0].pass);
      
      if (isCorrectPassword) {
        const staffId = staffExists[0].staff_id;
        const staffname = staffExists[0].staffname;
        const avatar = staffExists[0].avatar;

        req.session!.staffInfo = {};
        req.session!.staffInfo.staffId = staffId;
        req.session!.staffInfo.staffname = staffname;

        return res.json({message: 'Signed in.', staffname, avatar});
      }
    }

    res.send({message: 'Incorrect email or password.'});
  },

  logout: async function(req: Request, res: Response) {
    req.session!.destroy(function() {});
    res.end();
  }
};