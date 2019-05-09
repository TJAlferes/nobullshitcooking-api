const bcrypt = require('bcrypt');

const pool = require('../../data-access/dbPoolConnection');
const Staff = require('../../data-access/staff/Staff');
const validator = require('../../lib/validations/staff');

const SALT_ROUNDS = 10;
const DEFAULT_PLAN = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
  15: [],
  16: [],
  17: [],
  18: [],
  19: [],
  20: [],
  21: [],
  22: [],
  23: [],
  24: [],
  25: [],
  26: [],
  27: [],
  28: []
};

const staffAuthController = {
  register: async function(req, res, next) {
    try {
      const email = req.body.staffInfo.email;
      const password = req.body.staffInfo.password;
      const staffname = req.body.staffInfo.staffname;
      //validator.validate(staffInfo);  // implement control flow here
      // return if already logged in
      const staff = new Staff(pool);
      const emailExists = await user.getUserByEmail(email);
      if (emailExists === []) {
        res.send('email already in use... lost your password?');
        next();
      }
      const staffExists = await staff.getStaffByName(staffname);
      if (staffExists !== []) {
        res.send('staffname already taken');
        next();
      }
      const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await staff.createStaff({email, password: encryptedPassword, staffname, avatar: '', plan: DEFAULT_PLAN});
      res.send('be yay');
      next();
    } catch(err) {
      next(err);
    }
  },
  login: async function(req, res, next) {
    try {
      const email = req.body.staffInfo.email;
      const password = req.body.staffInfo.password;
      //validator.validate(staffInfo);  // implement control flow here
      const staff = new Staff(pool);
      const staffExists = await staff.getStaffByEmail(email);
      if (staffExists) {
        const isCorrectPassword = await bcrypt.compare(password, staffExists[0].pass);
        if (isCorrectPassword) {
          const staffId = staffExists[0].staff_id;
          const staffname = staffExists[0].staffname;
          const avatar = staffExists[0].avatar;
          req.session.staffId = staffId;
          return res.json({staffname, avatar});
        }
      }
      //res.redirect('/401');
      res.end();
      next();
    } catch(err) {
      next(err);
    }
  },
  logout: async function(req, res, next) {  // use router.delete here?
    try {
      await req.session.destroy(err => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.end();  //res.json({});  ??? res.redirect('/home')?
      });
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = staffAuthController;