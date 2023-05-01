import { defaulted, number, object, string } from 'superstruct';

export const validPlan = object({
  authorId: number(),
  ownerId:  number(),
  name:     string(),
  data: defaulted(
    string(),
    JSON.stringify({
       1: [],  2: [],  3: [],  4: [],  5: [],  6: [],  7: [],
       8: [],  9: [], 10: [], 11: [], 12: [], 13: [], 14: [],
      15: [], 16: [], 17: [], 18: [], 19: [], 20: [], 21: [],
      22: [], 23: [], 24: [], 25: [], 26: [], 27: [], 28: []
    })
  )
});
