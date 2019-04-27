const bcrypt = require('bcrypt');  // or bcryptjs?
const uuidv4 = require('uuid/v4');

const pool = require('../../data-access/dbPoolConnection');
const Staff = require('../../data-access/staff/Staff');
const validator = require('../../lib/validations/staff');

const SALT_ROUNDS = 10;

const staffAuthController = {
  register: async function(req, res) {
    const staffInfo = req.body.staffInfo;
    validator.validate(staffInfo);  // implement control flow here
    // return if already logged in
    const { staffname, password } = staffInfo;
    const staff = new Staff(pool);
    const staffExists = await staff.getStaffByName({staffname});
    if (staffExists) return res.send('staffname already taken');
    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await staff.createStaff({staffname, password: encryptedPassword});
    //res.redirect('/staff/login');
  },
  login: async function(req, res) {
    const staffInfo = req.body.staffInfo;
    validator.validate(staffInfo);  // implement control flow here
    const { staffname, password } = staffInfo;
    const staff = new Staff(pool);
    const staffExists = await staff.getStaffByName({staffname});
    if (staffExists) {
      const isCorrectPassword = await bcrypt.compare(password, staff.password);
      if (isCorrectPassword) {
        req.session.staffId = staff.staff_id;
        let CSRFToken = uuidv4();
        req.ression.csrfToken = CSRFToken;
        return res.send({CSRFToken});
        //return res.redirect('/staff/dashboard');
      }
    }
    res.redirect('/401');
  },
  logout: function(req, res) {  // use router.delete here?
    req.session.destroy(err => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      return res.end();  //res.json({});  ??? res.redirect('/home')?
    });
  }
};

module.exports = staffAuthController;