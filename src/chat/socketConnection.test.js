//const socketConnection = require('./socketConnection');

describe('the socketConnection handler', () => {
  it('needs finished tests', () => {
    expect(1).toEqual(1);
  });
});

/*
//const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');

let socket;
let httpServer;
let httpServerAddr;
let ioServer;

beforeAll((done) => {
  httpServer = http.createServer().listen();
  httpServerAddr = httpServer.listen().address();
  ioServer = ioBack(httpServer);
  done();
});

afterAll((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

beforeEach((done) => {
  // Do not hardcode server port and address, square brackets are used for IPv6
  socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  socket.on('connect', () => {
    done();
  });
});

afterEach((done) => {
  if (socket.connected) socket.disconnect();
  done();
});

describe('basic socket.io example', () => {
  it('should communicate', (done) => {
    ioServer.emit('echo', 'Hello World');
    socket.once('echo', (message) => {
      expect(message).toBe('Hello World');  // Check that the message matches
      done();
    });
    ioServer.on('connection', (mySocket) => {
      expect(mySocket).toBeDefined();
    });
  });

  it('should communicate with waiting for socket.io handshakes', (done) => {
    // Emit sth from Client do Server
    socket.emit('examlpe', 'some messages');
    // Use timeout to wait for socket.io server handshakes
    setTimeout(() => {
      // Put your server side expect() here
      done();
    }, 50);
  });
});
*/

/*
'use strict';

var expect = require('chai').expect
  , server = require('../index')
  , io = require('socket.io-client')
  , ioOptions = { 
      transports: ['websocket']
    , forceNew: true
    , reconnection: false
  }
  , testMsg = 'HelloWorld'
  , sender
  , receiver

describe('Chat Events', function() {
  beforeEach(function(done) {
    server.start();
    sender = io('http://localhost:3000/', ioOptions);
    receiver = io('http://localhost:3000/', ioOptions);
    done();
  });

  afterEach(function(done) {
    sender.disconnect();
    receiver.disconnect();
    done();
  });

  describe('Message Events', function() {
    it(
      'Clients should receive a message when the `message` event is emited.',
      function(done) {
        sender.emit('message', testMsg);
        receiver.on('message', function(msg){
          expect(msg).to.equal(testMsg);
          done();
        });
      }
    );
  });
});
*/