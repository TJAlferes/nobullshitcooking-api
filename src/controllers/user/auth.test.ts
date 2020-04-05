const httpMocks = require('node-mocks-http');
//const request = require('supertest');

//const app = require('../../app');

const userAuthController = require('./auth');

describe('userAuthController', () => {
  let req;
  let res;

  // move into inner describes?
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  describe('updateUsername', () => {
    /*it('should integrate', () => {
      return request(app).put('/user/auth/update/username').expect(200);
    });*/

    it('should send a response', async () => {
      req.body.userInfo = {
        username
      };
      await userAuthController.updateUsername(req, res);
      //expect(res.send()).toBeCalledTimes(1);  // only works with jest.fn()

    });
  });
});