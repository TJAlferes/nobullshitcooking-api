export const catchExceptions = func => 
  (req, res, next) =>
    Promise
    .resolve(func(req, res, next))
    .catch(next);