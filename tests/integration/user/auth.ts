import request from 'supertest';

import { server } from '../index.test.js';

export function userAuthTests() {
  describe('POST /v1/users', () => {
    const args = {
      email:    "newuser@site.com",
      password: "secret",
      username: "newuser"
    };

    it('handles email already in use', async () => {
      const res = await request(server).post('/v1/users').send(args);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({message: 'Username already in use.'});
    });

    it('handles username already in use', async () => {
      const res = await request(server).post('/v1/users').send(args);
      expect(res.status).toBe(500);
      expect(res.body).toEqual({message: 'Username already in use.'});
    });
    
    it('handles success', async () => {
      const res = await request(server).post('/v1/users').send(args);
      expect(res.status).toBe(201);
    });
  });

  describe('POST /resend-confirmation-code', () => {
    const args = {
      email: "newuser@site.com",
      password: "secret"
    };

    it('resends confirmation code', async () => {
      const res = await request(server).post('/v1/resend-confirmation-code').send(args);
      expect(res.body).toEqual({message: 'Confirmation code re-sent.'});
    });

    it('does not resend to an already confirmed user', async () => {
      const res = await request(server).post('/v1/resend-confirmation-code').send(args);
      expect(res.body).toEqual({message: "Already confirmed."});
    });

    it('does not resend to non-existing user', async () => {
      const res = await request(server).post('/v1/resend-confirmation-code').send({
        email: "nonuser@site.com",
        password: "secret"
      });
      expect(res.body).toEqual({message: "Incorrect email or password."});
    });
  });

  describe('POST /confirm', () => {
    const args = {
      email: "newuser@site.com",
      password: "secret",
      confirmationCode: "confirmationCode"
    };
    const message = "An issue occurred, please double check your info and try again.";

    it('confirms new user', async () => {
      const res = await request(server).post('/v1/confirm').send(args);
      expect(res.body).toEqual({message: 'User account confirmed.'});
    });

    it('does not confirm already confirmed user', async () => {
      const res = await request(server).post('/v1/confirm').send(args);
      expect(res.body).toEqual({message});
    });

    it('does not confirm non-existing user', async () => {
      const res = await request(server).post('/v1/confirm').send({
        email: "nonuser@site.com",
        password: "secret",
        confirmationCode: "confirmationCode"
      });
      expect(res.body).toEqual({message});
    });
  });

  describe('POST /login', () => {  // TO DO: needs setups
    it('logs in existing user', async () => {
      const res = await request(server).post('/v1/login').send({
        email: "user@site.com",
        password: "secret"
      });
      expect(res.body).toEqual({
        message: "Signed in.",
        username: "Person"
      });
    });

    it('does not log in already logged in user', async () => {
      const res = await request(server).post('/v1/login').send({
        email: "loggedinuser@site.com",
        password: "secret"
      });
      expect(res.body).toEqual({
        message: 'Already logged in.'
      });
    });

    it('does not log in non-existing user', async () => {
      const res = await request(server).post('/v1/login').send({
        email: "nonuser@site.com",
        password: "secret"
      });
      expect(res.body).toEqual({
        message: "Incorrect email or password."
      });
    });
  });
}
