import request from 'supertest';

import { server } from './app';
import { pool } from './lib/connections/mysqlPoolConnection';
import { User } from './mysql-access/User';

const user = new User(pool);  // DO NOT use this, make a separate test DB

// Make sure this NEVER touches prod DBs

// Avoid global seeds and fixtures, add data per test (per it)

beforeEach(async () => {
  
});



describe('the /user/auth/register endpoint', () => {
  it('should register a new user', async () => {
    await request(server)
    .post('/user/auth/register')
    .send({email: "newuser@site.com", password: "secret", username: "newuser"})
    .expect(201);
  });

  it('should not register an already registered user', async () => {
    await request(server)
    .post('/user/auth/register');
  });
});



describe('the /user/auth/login endpoint', () => {
  it('should log in an existing user', async () => {
    await request(server)
    .post('/user/auth/login')
    .send({email: "user@site.com", password: "secret"})
    .expect(201);
  });

  it('should not log in an already logged in user', () => {
    await request(server)
    .post('/user/auth/login')
    .send({email: "loggedinuser@site.com", password: "secret"})
  });

  it('should not log in a non-existing user', async () => {
    await request(server)
    .post('/user/auth/login')
    .send({email: "nonuser@site.com", password: "secret"})
    .expect(201);
  });
});



describe('the /user/auth/logout endpoint', () => {
  it('should log out an existing user', async () => {
    await request(server)
    .post('/user/auth/logout');
  });

  it('should not log out a non-existing user', async () => {
    await request(server)
    .post('/user/auth/logout');
  });
});