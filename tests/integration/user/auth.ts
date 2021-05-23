import request from 'supertest';

import { server } from '../index.test';

// TO DO: fix and finish
export function userAuthTests() {
  describe('POST /user/auth/register', () => {
    const args =
      {email: "newuser@site.com", pass: "secret", username: "newuser"};
    
    it('registers new user', async () => {
      const { body } =
        await request(server).post('/user/auth/register').send(args);
      expect(body).toEqual({message: 'User account created.'});
    });

    it('does not register already registered user', async () => {
      const { body } =
        await request(server).post('/user/auth/register').send(args);
      expect(body).toEqual(1);
    });
  });

  describe('POST /user/auth/verify', () => {
    const args = {
      email: "newuser@site.com",
      pass: "secret",
      confirmationCode: "confirmationCode"
    };

    it('verifies new user', async () => {
      const { body } =
        await request(server).post('/user/auth/verify').send(args);
      expect(body).toEqual({message: 'User account verified.'});
    });

    it('does not verify already verified user', async () => {
      const { body } =
        await request(server).post('/user/auth/verify').send(args);
      expect(body).toEqual(1);
    });
  });

  describe('POST /user/auth/resend-confirmation-code', () => {
    const args = {email: "newuser@site.com", pass: "secret"};
    it('resends confirmation code', async () => {
      const { body } = await request(server)
        .post('/user/auth/resend-confirmation-code')
        .send(args);
      expect(body).toEqual({message: 'Confirmation code re-sent.'});
    });

    it('does not resend to an already verified user', async () => {
      const { body } = await request(server)
        .post('/user/auth/resend-confirmation-code')
        .send(args);
      expect(body).toEqual(1);
    });
  });

  describe('POST /user/auth/login', () => {
    it('logs in existing user', async () => {
      const { body } = await request(server).post('/user/auth/login')
        .send({email: "user@site.com", pass: "secret"});
      expect(body)
        .toEqual({message: "Signed in.", username: "Person", avatar: "Person"});
    });

    it('does not log in already logged in user', async () => {
      const { body } = await request(server).post('/user/auth/login')
        .send({email: "loggedinuser@site.com", pass: "secret"});
      expect(body).toEqual(1);
    });

    it('does not log in non-existing user', async () => {
      const { body } = await request(server).post('/user/auth/login')
        .send({email: "nonuser@site.com", pass: "secret"})
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