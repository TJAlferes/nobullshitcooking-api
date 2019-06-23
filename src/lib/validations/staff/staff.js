const { struct } = require('superstruct');

const validStaffEntity = struct(
  {
    email: 'string',
    pass: 'string',
    staffname: 'string',
    avatar: 'string?'
  },
  {
    avatar: 'nobsc-staff-default-avatar'
  }
);

module.exports = validStaffEntity;