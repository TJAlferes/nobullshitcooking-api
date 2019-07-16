const StatusError = require('./StatusError');

module.exports = function(req, res, next) {
  if (req.session.userInfo.hasOwnProperty(userId))  return next();
  /*req.session.destroy(err => {
    if (err) reject(err);
    res.clearCookie('connect.sid')
  });*/
  res.clearCookie('connect.sid');
  //res.end();
  //res.send('Please sign in.');
  return next(new StatusError("Unauthorized", 401));
};