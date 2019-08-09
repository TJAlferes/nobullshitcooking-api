//const crypto = require('crypto');
const bcrypt = require('bcrypt');

const pool = require('../../lib/connections/mysqlPoolConnection');
const Staff = require('../../mysql-access/Staff');
const validLoginRequest = require('../../lib/validations/staff/loginRequest');
const validRegisterRequest = require('../../lib/validations/staff/registerRequest');
const validStaffEntity = require('../../lib/validations/staff/staffEntity');

const SALT_ROUNDS = 10;

const staffAuthController = {
  register: async function(req, res, next) {
    try {
      const email = req.sanitize(req.body.staffInfo.email);
      const pass = req.sanitize(req.body.staffInfo.password);
      const staffname = req.sanitize(req.body.staffInfo.staffname);
      validRegisterRequest({email, pass, staffname});

      // to do: return if already logged in

      const staff = new Staff(pool);

      const emailExists = await staff.getStaffByEmail(email);
      if (emailExists === []) {
        res.send({message: 'Email already in use.'});
        return next();
      }

      const staffExists = await staff.getStaffByName(staffname);
      if (staffExists !== []) {
        res.send({message: 'Staffname already taken.'});
        return next();
      }

      const encryptedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
      const staffToCreate = validStaffEntity({email, pass: encryptedPassword, staffname});
      await staff.createStaff(staffToCreate);

      res.send({message: 'Staff account created.'});
      next();
    } catch(err) {
      next(err);
    }
  },
  login: async function(req, res, next) {
    try {
      const email = req.sanitize(req.body.staffInfo.email);
      const pass = req.sanitize(req.body.staffInfo.password);
      validLoginRequest({email, pass});
      const staff = new Staff(pool);
      const staffExists = await staff.getStaffByEmail(email);
      if (staffExists && staffExists[0].email == email) {
        const isCorrectPassword = await bcrypt.compare(pass, staffExists[0].pass);
        if (isCorrectPassword) {
          const staffId = staffExists[0].staff_id;
          const staffname = staffExists[0].staffname;
          const avatar = staffExists[0].avatar;
          req.session.staffInfo = {};
          req.session.staffInfo.staffId = staffId;
          req.session.staffInfo.staffname = staffname;
          res.json({message: 'Signed in.', staffname, avatar});
          return next();
        }
      }
      res.send({message: 'Incorrect email or password.'});
      next();
    } catch(err) {
      next(err);
    }
  },
  logout: async function(req, res) {
    await req.session.destroy();
    res.end();
  }
};

module.exports = staffAuthController;