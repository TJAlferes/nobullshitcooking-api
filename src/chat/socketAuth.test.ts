import { Socket } from 'socket.io';

import {
  addMessengerUser,
  sessionIdsAreEqual,
  //useSocketAuth
} from './socketAuth';

jest.mock('../redis-access/MessengerUser', () => ({
  MessengerUser: jest.fn().mockImplementation(() => ({addUser: mockAddUser}))
}));
let mockAddUser = jest.fn();

describe('addMessengerUser helper', () => {
  it('copies sid to socket.request correctly', () => {
    const socket: Partial<Socket> = {
      id: '123456789',
      request: {headers: {cookie: {'connect.sid': '123456789'}}}
    };
    const sid = '123456789';
    const session: Partial<Express.SessionData> = {
      userInfo: {userId: 150, username: "Name", avatar: "Name123"}
    };
    addMessengerUser(<Socket>socket, sid, <Express.SessionData>session);
    expect(socket.request.sid).toEqual('123456789');
  });

  it('copies session.userInfo to the socket.request', () => {
    const socket: Partial<Socket> = {
      id: '123456789',
      request: {headers: {cookie: {'connect.sid': '123456789'}}}
    };
    const sid = '123456789';
    const session: Partial<Express.SessionData> = {
      userInfo: {userId: 150, username: "Name", avatar: "Name123"}
    };
    addMessengerUser(<Socket>socket, sid, <Express.SessionData>session);
    expect(socket.request.userInfo)
    .toEqual({userId: 150, username: "Name", avatar: "Name123"});
  });

  it ('uses addUser correctly', () => {
    const socket: Partial<Socket> = {
      id: '123456789',
      request: {headers: {cookie: {'connect.sid': '123456789'}}}
    };
    const sid = '123456789';
    const session: Partial<Express.SessionData> = {
      userInfo: {userId: 150, username: "Name", avatar: "Name123"}
    };
    addMessengerUser(<Socket>socket, sid, <Express.SessionData>session);
    expect(mockAddUser)
    .toHaveBeenCalledWith(150, "Name", "Name123", '123456789', '123456789');
  });
});

describe('sessionIdsAreEqual helper', () => {
  it('returns false if session Ids are not equal', () => {
    const socket: Partial<Socket> = {request: {headers: {cookie: {}}}};
    const actual = sessionIdsAreEqual(<Socket>socket);
    expect(actual).toEqual(false);
  });

  it('returns true if session Ids are equal', () => {
    const socket: Partial<Socket> = {
      request: {headers: {cookie: {'connect.sid': '123456789'}}}
    };
    const actual = sessionIdsAreEqual(<Socket>socket);
    expect(actual).toEqual(true);
  });
});

// find a way to make this unit testable
/*describe('socketAuth middleware', () => {
  const redisSessionStub = {get(something, callback) {}};
  const nextStub = passed => passed;
  it(`
    should return Error 'Not authenticated.'
    when the compared session IDs don't match
  `, () => {

  });

  it(`
    should return Error 'Not authenticated.'
    when there is no .userInfo.userId present in the session
  `, () => {
    
  });

  it('should copy the session.userInfo to the socket.request', () => {
    const session: Partial<Express.SessionData> = {
      userInfo: {userId: 150, username: "Name", avatar: "Name123"}
    };
    const socket: Partial<Socket> = {
      request: {headers: {cookie: {'connect.sid': '123456789'}}}
    };
    useSocketAuth(io, redisSessionStub);
    expect(socketStub.request.userInfo).toEqual(sessionStub.userInfo);
  });

  it('should copy the sid to the socket.request', () => {
    const socket: Partial<Socket> = {
      request: {headers: {cookie: {'connect.sid': '123456789'}}}
    };
    useSocketAuth(io, redisSessionStub);
  });
});*/