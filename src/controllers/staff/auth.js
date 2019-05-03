const bcrypt = require('bcrypt');  // or bcryptjs?
//const uuidv4 = require('uuid/v4');

const pool = require('../../data-access/dbPoolConnection');
const Staff = require('../../data-access/staff/Staff');
const validator = require('../../lib/validations/staff');

const SALT_ROUNDS = 10;

const staffAuthController = {
  register: async function(req, res) {
    // change...
    const staffInfo = req.body.staffInfo;

    //validator.validate(staffInfo);  // implement control flow here
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
  },
  logout: function(req, res) {  // use router.delete here?
    req.session.destroy(err => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.end();  //res.json({});  ??? res.redirect('/home')?
    });
  }
};

module.exports = staffAuthController;