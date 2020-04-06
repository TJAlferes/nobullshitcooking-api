import { Request, Response } from 'express';
//const crypto = require('crypto');
const bcrypt = require('bcrypt');

const pool = require('../../lib/connections/mysqlPoolConnection');
const Staff = require('../../mysql-access/Staff');
const validLoginRequest = require('../../lib/validations/staff/loginRequest');
const validRegisterRequest = require('../../lib/validations/staff/registerRequest');
const validStaffEntity = require('../../lib/validations/staff/staffEntity');

const SALT_ROUNDS = 10;

const staffAuthController = {
  register: async function(req: Request, res: Response) {
    const email = req.sanitize(req.body.staffInfo.email);
    const pass = req.sanitize(req.body.staffInfo.password);
    const staffname = req.sanitize(req.body.staffInfo.staffname);

    validRegisterRequest({email, pass, staffname});

    if (staffname.length < 6) {
      return res.send({message: 'Staffname must be at least 6 characters.'});
    }
    if (staffname.length > 20) {
      return res.send({message: 'Staffname must be no more than 20 characters.'});
    }
    // Problem: This would invalidate some older/alternative email types. Remove?
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return res.send({message: 'Invalid email.'});
    }
    if (pass.length < 6) {
      return res.send({message: 'Password must be at least 6 characters.'});
    }
    if (pass.length > 54) {
      return res.send({message: 'Password must be no more than 54 characters.'});
    }

    const staff = new Staff(pool);

    const staffExists = await staff.getStaffByName(staffname);
    if (staffExists.length) return res.send({message: 'Staffname already taken.'});

    const emailExists = await staff.getStaffByEmail(email);
    if (emailExists.length) return res.send({message: 'Email already in use.'});

    const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
    const staffToCreate = validStaffEntity({email, pass: encryptedPassword, staffname});
    await staff.createStaff(staffToCreate);

    res.send({message: 'Staff account created.'});
  },
  
  login: async function(req: Request, res: Response) {
    const email = req.sanitize(req.body.staffInfo.email);
    const pass = req.sanitize(req.body.staffInfo.password);

    validLoginRequest({email, pass});

    // Problem: This would invalidate some older/alternative email types. Remove?
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

        req.session.staffInfo = {};
        req.session.staffInfo.staffId = staffId;
        req.session.staffInfo.staffname = staffname;

        return res.json({message: 'Signed in.', staffname, avatar});
      }
    }

    res.send({message: 'Incorrect email or password.'});
  },

  logout: async function(req: Request, res: Response) {
    await req.session.destroy();
    res.end();
  }
};

module.exports = staffAuthController;