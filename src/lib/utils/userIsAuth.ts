const StatusError = require('./StatusError');

export function userIsAuth(req, res, next) {
  if (req.session && req.session.userInfo.userId) return next();  // insufficient?
  return next(new StatusError("Unauthorized", 401));
};