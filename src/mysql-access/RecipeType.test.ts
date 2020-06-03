const mysql = require('mysql2/promise');

import { RecipeType } from './RecipeType';

const data = [[{"key": "value"}]];

jest.mock('mysql2/promise');
mysql.createPool.mockImplementation(() => ({
  execute: jest.fn().mockResolvedValue(data)
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('RecipeType', () => {
  const pool = mysql.createPool();
  const recipeType = new RecipeType(pool);

  it('1', async () => {
    const results = await recipeType.viewAllRecipeTypes();
    expect(pool.execute).toBeCalledTimes(1);
    expect(results).toEqual([{"key": "value"}]);
  });

  it('2', async () => {
    const [ result ] = await recipeType.viewRecipeTypeById(1);
    expect(pool.execute).toBeCalledTimes(1);
    expect(result).toEqual({"key": "value"});
  });
});