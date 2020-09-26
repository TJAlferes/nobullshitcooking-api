import request from 'supertest';

import { server } from '../index.test';

export function userAuthTests() {
  describe('POST /user/auth/register', () => {
    it('registers new user', async () => {
      const { body } = await request(server).post('/user/auth/register')
        .send({
          email: "newuser@site.com",
          password: "secret",
          username: "newuser"
        });
      expect(body).toEqual({message: 'User account created.'});
    });

    it('does not register already registered user', async () => {
      const { body } = await request(server).post('/user/auth/register')
        .send({
          email: "newuser@site.com",
          password: "secret",
          username: "newuser"
        });
      expect(body).toEqual(1);
    });
  });

  describe('POST /user/auth/verify', () => {
    it('verifies new user', async () => {
      const { body } = await request(server).post('/user/auth/verify')
        .send({
          email: "newuser@site.com",
          password: "secret",
          confirmationCode: "confirmationCode"
        });
      expect(body).toEqual({message: 'User account verified.'});
    });

    it('does not verify already verified user', async () => {
      const { body } = await request(server).post('/user/auth/verify')
        .send({
          email: "newuser@site.com",
          password: "secret",
          confirmationCode: "confirmationCode"
        });
      expect(body).toEqual(1);
    });
  });

  describe('POST /user/auth/resend-confirmation-code', () => {
    it('resends confirmation code', async () => {
      const { body } = await request(server)
        .post('/user/auth/resend-confirmation-code')
        .send({email: "newuser@site.com", password: "secret"});
      expect(body).toEqual({message: 'Confirmation code re-sent.'});
    });

    it('does not resend to an already verified user', async () => {
      const { body } = await request(server)
        .post('/user/auth/resend-confirmation-code')
        .send({email: "newuser@site.com", password: "secret"});
      expect(body).toEqual(1);
    });
  });

  describe('POST /user/auth/login', () => {
    it('logs in existing user', async () => {
      const { body } = await request(server).post('/user/auth/login')
        .send({email: "user@site.com", password: "secret"});
      expect(body)
        .toEqual({message: "Signed in.", username: "Person", avatar: "Person"});
    });

    it('does not log in already logged in user', async () => {
      const { body } = await request(server).post('/user/auth/login')
        .send({email: "loggedinuser@site.com", password: "secret"});
      expect(body).toEqual(1);
    });

    it('does not log in non-existing user', async () => {
      const { body } = await request(server).post('/user/auth/login')
        .send({email: "nonuser@site.com", password: "secret"})
      expect(body).toEqual(1);
    });
  });

  describe('POST /user/auth/logout', () => {
    it('logs out existing user', async () => {
      const { body } = await request(server).post('/user/auth/logout');
      expect(body).toEqual(1);
    });

    it('does not log out non-existing user', async () => {
      const { body } = await request(server).post('/user/auth/logout');
      expect(body).toEqual(1);
    });
  });
}