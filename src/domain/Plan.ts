import { array, assert, defaulted, number, object, string } from 'superstruct';

import { GenerateId, Id } from './shared';

export class Plan {
  private id;
  private authorId;
  private ownerId;
  private name;
  private data;

  private constructor(params: PlanParams) {
    this.id       = GenerateId();
    this.authorId = Id(params.authorId);
    this.ownerId  = Id(params.ownerId);
    this.name     = PlanName(params.name);
    this.data     = PlanData(params.data);
  }
}

export function PlanName(name: string) {
  assert(name, string());
  if (name.length > ) {
    throw new Error("Plan name must be");
  }
  return name;
}

export function PlanData(data: string) {
  assert(
    data,
    defaulted(
      string(),
      JSON.stringify({
         1: [],  2: [],  3: [],  4: [],  5: [],  6: [],  7: [],
         8: [],  9: [], 10: [], 11: [], 12: [], 13: [], 14: [],
        15: [], 16: [], 17: [], 18: [], 19: [], 20: [], 21: [],
        22: [], 23: [], 24: [], 25: [], 26: [], 27: [], 28: []
      })
    )
  );
  const dataCopy      = (' ' + data).slice(1);
  const dataCopyToObj = JSON.parse(dataCopy);
  assert(
    dataCopyToObj,
    object({
       1: array(object()),  2: array(object()),  3: array(object()),  4: array(object()),  5: array(object()),  6: array(object()),  7: array(object()),
       8: array(object()),  9: array(object()), 10: array(object()), 11: array(object()), 12: array(object()), 13: array(object()), 14: array(object()), 
      15: array(object()), 16: array(object()), 17: array(object()), 18: array(object()), 19: array(object()), 20: array(object()), 21: array(object()), 
      22: array(object()), 23: array(object()), 24: array(object()), 25: array(object()), 26: array(object()), 27: array(object()), 28: array(object())
    })
  );
  return data;
}

type PlanParams = {
  authorId: string;
  ownerId:  string;
  name:     string;
  data:     string;
};

/*export class PlanDay {}
export class Day {}
export class DayTask {}
export class Task {}*/

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
