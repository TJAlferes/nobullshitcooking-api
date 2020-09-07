import { defaulted, object, string } from 'superstruct';

export const validStaffCreation = object({
  email: string(),
  pass: string(),
  staffname: string(),
  avatar: defaulted(string(), 'nobsc-staff-default'),
  role: defaulted(string(), 'staff')
});