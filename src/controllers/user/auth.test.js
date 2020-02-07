const httpMocks = require('node-mocks-http');

const userAuthController = require('./auth');

let req;
let res;
let next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('userAuthController', () => {
  describe('changeUsername', () => {
    it('should send a response', () => {
      expect(res.send()).toBeCalledTimes(1);
    });
  });
});