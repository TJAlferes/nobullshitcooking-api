import { StatusError } from './StatusError';

export function staffIsAuth(req, res, next) {
  if (req.session && req.session.staffInfo.staffId) return next();  // insufficient?
  return next(new StatusError("Unauthorized", 401));
};