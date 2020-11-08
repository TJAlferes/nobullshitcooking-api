import { defaulted, object, string } from 'superstruct';

export const validProductEntity = object({
  category: string(),
  type: string(),
  brand: defaulted(string(), ''),
  variety: defaulted(string(), ''),
  name: string(),
  //alt_names:
  description: string(),
  //specs:
  image: defaulted(string(), 'nobsc-product-default')
});