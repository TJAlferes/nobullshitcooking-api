'use strict';

const {
  sessionIdsAreEqual,
  addMessengerUser,
  socketAuth
} = require('./socketAuth');

describe('the sessionIdsAreEqual helper function', () => {
  it('should have one parameter', () => {
    const actual = sessionIdsAreEqual.length;
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it('should return true if session Ids are equal', () => {
    const socket = {
      request: {
        headers: {
          cookie: {
            'connect.sid': '123456789'
          }
        }
      }
    };
    const actual = sessionIdsAreEqual(socket);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it('should return false if session Ids are not equal', () => {
    const socket = {
      request: {
        headers: {
          cookie: {}
        }
      }
    };
    const actual = sessionIdsAreEqual(socket);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe('the addMessengerUser helper function', () => {
  it('should have three parameters', () => {
    const actual = addMessengerUser.length;
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it('should copy the sid to the socket.request', () => {
    const socket = {
      request: {
        headers: {
          cookie: {
            'connect.sid': '123456789'
          }
        }
      }
    };
    const sid;
    const session;
    addMessengerUser(socket, sid, session);
    const actual = sock
    expect(1).toEqual(1);
  });
});

describe('the socketAuth middleware', () => {
  it('should have one parameter', () => {
    const actual = socketAuth.length;
    const expected = 1;
    expect(actual).toEqual(expected);
  });
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