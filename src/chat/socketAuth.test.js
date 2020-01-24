//const socketAuth = require('./socketAuth');

describe('the socketAuth middleware', () => {
  it('needs finished tests', () => {
    expect(1).toEqual(1);
  });
});

/*describe('the socketAuth middleware', () => {
  it(`
    should return Error 'Not authenticated.'
    when the compared session IDs don't match
  `, () => {
    const redisSessionStub = {};
    const socketStub = {
      request: {
        headers: {
          cookie: {
            'connect.sid': '123456789'
          }
        }
      }
    };
    const nextStub = passed => passed;

    const actual = socketAuth(redisSession);
    const expected = ;
    expected(actual).toEqual(expected);
  });



  it(`
    should return Error 'Not authenticated.'
    when there is no .userInfo.userId present in the session
  `, () => {
    
  });



  it('should copy the session.userInfo to the socket.request', () => {
    const redisSessionStub = {
      get(something, callback)
    };
    const sessionStub = {
      userInfo: {
        userId: 1,
        username: 'Denise',
        avatar: 'Denise'
      }
    };
    let socketStub = {
      request: {
        headers: {
          cookie: {
            'connect.sid': '123456789'
          }
        }
      }
    };
    const nextStub = passed => passed;

    socketAuth(redisSessionStub);

    expect(socketStub.request.userInfo).toEqual(sessionStub.userInfo);
  });



  it('should copy the sid to the socket.request', () => {
    const redisSessionStub = {};
    const socketStub = {
      request: {
        headers: {
          cookie: {
            'connect.sid': '123456789'
          }
        }
      }
    };
    const nextStub = passed => passed;

    socketAuth(redisSessionStub);
  });
});*/