import request from 'supertest';

import { server } from '../index.test';

export function staffAuthTests() {
  describe('POST /staff/auth/register', () => {
    it('registers new staff', async () => {
      const { body } = await request(server).post('/staff/auth/register')
        .send({
          email: "newstaff@site.com",
          password: "secret",
          staffname: "newstaff"
        });
      expect(body).toEqual(1);
    });

    it('does not register already registered staff', async () => {
      const { body } = await request(server).post('/staff/auth/register')
        .send({
          email: "newstaff@site.com",
          password: "secret",
          staffname: "newstaff"
        });
      expect(body).toEqual(1);
    });
  });

  describe('POST /staff/auth/login', () => {
    it('logs in existing staff', async () => {
      const { body } = await request(server).post('/staff/auth/login')
        .send({email: "staff@site.com", password: "secret"});
      expect(body).toEqual(1);
    });

    it('does not log in already logged in staff', async () => {
      const { body } = await request(server).post('/staff/auth/login')
        .send({email: "loggedinstaff@site.com", password: "secret"});
      expect(body).toEqual(1);
    });

    it('does not log in non-existing staff', async () => {
      const { body } = await request(server).post('/staff/auth/login')
        .send({email: "nonstaff@site.com", password: "secret"})
      expect(body).toEqual(1);
    });
  });

  describe('POST /staff/auth/logout', () => {
    it('logs out existing staff', async () => {
      const { body } = await request(server).post('/staff/auth/logout');
      expect(body).toEqual(1);
    });

    it('does not log out non-existing staff', async () => {
      const { body } = await request(server).post('/staff/auth/logout');
      expect(body).toEqual(1);
    });
  });
}