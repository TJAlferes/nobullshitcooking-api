import request from 'supertest';

import { server } from '../index.test.js';

export function userAuthTests() {
  describe('POST /v1/resend-confirmation-code', () => {
    it('handles already confirmed user', async () => {
      const res = await request(server).post('/v1/resend-confirmation-code').send({
        email: "newuser@site.com",
        password: "secret"
      });
      expect(res.status).toBe(4);
      expect(res.body).toEqual({message: "Already confirmed."});
    });

    it('handles non-existing user', async () => {
      const res = await request(server).post('/v1/resend-confirmation-code').send({
        email: "nonuser@site.com",
        password: "secret"
      });
      expect(res.status).toBe(4);
      expect(res.body).toEqual({message: "Incorrect email or password."});
    });

    it('handles success', async () => {
      const res = await request(server).post('/v1/resend-confirmation-code').send({
        email: "newuser@site.com",
        password: "secret"
      });
      expect(res.status).toBe(204);
    });
  });

  describe('POST /v1/confirm', () => {
    const message = "An issue occurred, please double check your info and try again.";

    it('handles already confirmed user', async () => {
      const res = await request(server)
        .post('/v1/confirm')
        .send({confirmation_code: "confirmationCode"});
      expect(res.status).toBe(4);
      expect(res.body).toEqual({message});
    });

    it('handles non-existing user', async () => {
      const res = await request(server)
        .post('/v1/confirm')
        .send({confirmationCode: "confirmationCode"});
      expect(res.status).toBe(4);
      expect(res.body).toEqual({message});
    });

    it('handles success', async () => {
      const res = await request(server)
        .post('/v1/confirm')
        .send({confirmation_code: "confirmationCode"});
      expect(res.status).toBe(204);
    });
  });

  describe('POST /login', () => {  // TO DO: needs setups
    it('handles already logged in user', async () => {
      const res = await request(server).post('/v1/login').send({
        email: "loggedinuser@site.com",
        password: "secret"
      });
      expect(res.body).toEqual({message: 'Already logged in.'});
    });

    it('handles non-existing user', async () => {
      const res = await request(server).post('/v1/login').send({
        email: "nonuser@site.com",
        password: "secret"
      });
      expect(res.body).toEqual({message: "Incorrect email or password."});
    });

    it('handles success', async () => {
      const res = await request(server).post('/v1/login').send({
        email: "user@site.com",
        password: "secret"
      });
      expect(res.status).toBe(201);
      expect(res.body).toContain({auth_email: "user@site.com"});
    });
  });
}
