const { struct } = require('superstruct');

const validPlanEntity = struct(
  {
    authorId: 'string',
    ownerId: 'string',
    plan_name: 'string',
    plan_data: 'object'
  },
  {
    plan_data: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
      13: [],
      14: [],
      15: [],
      16: [],
      17: [],
      18: [],
      19: [],
      20: [],
      21: [],
      22: [],
      23: [],
      24: [],
      25: [],
      26: [],
      27: [],
      28: []
    }
  }
);

module.exports = validPlanEntity;