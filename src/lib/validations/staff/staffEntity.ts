const { struct } = require('superstruct');

const validStaffEntity = struct(
  {
    email: 'string',
    pass: 'string',
    staffname: 'string',
    avatar: 'string?',
    role: 'string?'
  },
  {
    avatar: 'nobsc-staff-default',
    role: 'staff'
  }
);

module.exports = validStaffEntity;