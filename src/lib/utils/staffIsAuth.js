module.exports = function(req, res, next) {
  if (req.session.staffId) return next();
  res.redirect('/401');
};