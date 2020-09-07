import { defaulted, number, object, string } from 'superstruct';

export const validProductEntity = object({
  productCategoryId: number(),
  productTypeId: number(),
  brand: defaulted(string(), ''),
  variety: defaulted(string(), ''),
  name: string(),
  //alt_names:
  description: string(),
  //specs:
  image: defaulted(string(), 'nobsc-product-default')
});