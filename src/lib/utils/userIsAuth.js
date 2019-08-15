const StatusError = require('./StatusError');

module.exports = function(req, res, next) {
  if (req.session && req.session.userInfo) return next();  // insufficient!
  /*req.session.destroy(err => {
    if (err) reject(err);
    res.clearCookie('connect.sid')
  });*/
  //res.clearCookie('connect.sid');
  return next(new StatusError("Unauthorized", 401));
};