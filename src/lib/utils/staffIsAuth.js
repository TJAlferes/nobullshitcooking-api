const checkCSRF = require('./checkCSRF');

module.exports = function(req, res, next) {
  console.log('staffIsAuth reached');
  if (req.session.staffId) return checkCSRF(req, res, next);  // return next();
  console.log('lower reach');
  res.clearCookie('connect.sid');  // sufficient???
  res.redirect('/401');  // set this up?
};