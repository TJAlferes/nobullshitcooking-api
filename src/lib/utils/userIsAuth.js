//const checkCSRF = require('./checkCSRF');

module.exports = function(req, res, next) {
  //if (req.session.userId) return checkCSRF(req, res, next);  // return next();
  res.clearCookie('connect.sid');  // sufficient???
  res.end();  // set this up?
};