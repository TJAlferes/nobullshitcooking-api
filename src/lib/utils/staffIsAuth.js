const checkCSRF = require('./checkCSRF');

module.exports = function(req, res, next) {
  if (req.session.staffId) return checkCSRF(req, res, next);  // return next();
  res.clearCookie('connect.sid');  // sufficient???
  res.redirect('/401');  // set this up?
};