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
    const email = req.body.staffInfo.email;
    const password = req.body.staffInfo.password;
    console.log('staffInfo', email, password);
    //validator.validate(staffInfo);  // implement control flow here
    const staff = new Staff(pool);
    console.log('login controller reached');
    //console.log('staff: ', staff);
    const staffExists = await staff.getStaffByEmail(email);
    //console.log(await staff);
    if (staffExists) {
      const isCorrectPassword = await bcrypt.compare(password, staffExists[0].pass);
      if (isCorrectPassword) {
        req.session.staffId = staffExists[0].staff_id;
        console.log(req.session.staffId);
        //let CSRFToken = uuidv4();
        //let CSRFToken = req.csrfToken();
        //let CSRFToken = req.session.CSRFToken;
        //req.ression.csrfToken = req.get('X-CSRF-Token');

        //https://github.com/pillarjs/understanding-csrf
        // ask someone

        console.log('alright...');
        return res.json({okay: 'okay'});
        //return res.redirect('/staff/dashboard');
      }
    }
    //res.redirect('/401');
    res.end();
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