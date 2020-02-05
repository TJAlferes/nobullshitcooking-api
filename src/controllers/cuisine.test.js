const sinon = require('sinon');

const pool = require('../lib/connections/mysqlPoolConnection');
const Cuisine = require('../mysql-access/Cuisine');
const validCuisineRequest = require('../lib/validations/cuisine/cuisineRequest');

const cuisineController = require('./cuisine');

const cuisine = new Cuisine(pool);

let cuisineStub = sinon
.stub(cuisine, 'viewCuisineById')
.returns(Promise.resolve([]));

beforeEach(() => {
  cuisineStub.reset();
});

describe('the cuisine controller', () => {
  describe('the viewAllCuisines method', () => {
    it('should ', async () => {
      const actual = ;
      const expected = ;
      expected(actual).toEqual(expected);
    });
  });
  describe('the viewCuisineById method', () => {
    it('should throw an error if accessing the database fails', async () => {
      //const cuisine = new Cuisine(pool);
      //sinon.stub(cuisine, 'viewCuisineById');

      sinon.stub(validCuisineRequest);

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