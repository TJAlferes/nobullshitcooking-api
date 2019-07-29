const catchExceptions = func => 
  (req, res, next) =>
    Promise
    .resolve(func(req, res, next))
    .catch(next);

module.exports = catchExceptions;

// alternatively, https://www.npmjs.com/package/express-async-errors