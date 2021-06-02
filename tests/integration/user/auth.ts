import request from 'supertest';

import { server } from '../index.test';

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
      expect(body).toEqual({message: 'Username already taken.'});
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
      expect(body).toEqual({message: "Already verified."});
    });

    it('does not resend to non-existing user', async () => {
      const { body } = await request(server)
        .post('/user/auth/resend-confirmation-code')
        .send({email: "nonuser@site.com", pass: "secret"});
      expect(body).toEqual({message: "Incorrect email or password."});
    });
  });

  describe('POST /user/auth/verify', () => {
    const args = {
      email: "newuser@site.com",
      pass: "secret",
      confirmationCode: "confirmationCode"
    };
    const message =
      "An issue occurred, please double check your info and try again.";

    it('verifies new user', async () => {
      const { body } =
        await request(server).post('/user/auth/verify').send(args);
      expect(body).toEqual({message: 'User account verified.'});
    });

    it('does not verify already verified user', async () => {
      const { body } =
        await request(server).post('/user/auth/verify').send(args);
      expect(body).toEqual({message});
    });

    it('does not verify non-existing user', async () => {
      const { body } = await request(server)
        .post('/user/auth/resend-confirmation-code')
        .send({
          email: "nonuser@site.com",
          pass: "secret",
          confirmationCode: "confirmationCode"
        });
      expect(body).toEqual({message});
    });
  });

  describe('POST /user/auth/login', () => {  // TO DO: needs setups
    it('logs in existing user', async () => {
      const { body } = await request(server).post('/user/auth/login')
        .send({email: "user@site.com", pass: "secret"});
      expect(body).toEqual({message: "Signed in.", username: "Person"});
    });

    it('does not log in already logged in user', async () => {
      const { body } = await request(server).post('/user/auth/login')
        .send({email: "loggedinuser@site.com", pass: "secret"});
      expect(body).toEqual({message: 'Already logged in.'});
    });

    it('does not log in non-existing user', async () => {
      const { body } = await request(server).post('/user/auth/login')
        .send({email: "nonuser@site.com", pass: "secret"})
      expect(body).toEqual({message: "Incorrect email or password."});
    });
  });

  /*describe('POST /user/auth/logout', () => {  // TO DO: needs setups
    it('logs out existing user', async () => {
      const { body } = await request(server).post('/user/auth/logout');
      expect(body).toEqual(1);
    });
  });*/
}