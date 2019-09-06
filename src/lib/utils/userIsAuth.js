const StatusError = require('./StatusError');

module.exports = function(req, res, next) {
  if (req.session && req.session.userInfo.userId) return next();  // insufficient?
  return next(new StatusError("Unauthorized", 401));
};