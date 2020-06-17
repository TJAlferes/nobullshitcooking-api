import { pool } from '../lib/connections/mysqlPoolConnection';
import { validCuisineRequest } from '../lib/validations/cuisine/cuisineRequest';
import { Cuisine } from '../mysql-access/Cuisine';
import { cuisineController } from './cuisine';

const cuisine = new Cuisine(pool);

const cuisineStub = jest.fn();

/*let cuisineStub = sinon
.stub(cuisine, 'viewCuisineById')
.returns(Promise.resolve([]));

beforeEach(() => {
  cuisineStub.reset();
});*/

describe('cuisine controller', () => {
  describe('viewAllCuisines method', () => {
    it('should ', async () => {
      //const actual = ;
      //const expected = ;
      //expected(actual).toEqual(expected);
    });
  });
  describe('viewCuisineById method', () => {
    it('throws an error if accessing the database fails', async () => {
      //const cuisine = new Cuisine(pool);
      //sinon.stub(cuisine, 'viewCuisineById');

      //sinon.stub(validCuisineRequest);

      const req = {
        params: {
          cuisineId: 1
        }
      };

      const result = await cuisineController.viewCuisineById(req, {});  // bind()?

      const actual = result;
      const expected = ;
      expected(actual).toEqual(expected);
    });
  });
});