import request from 'supertest';

import { server } from '../index.test';

export function staffAuthTests() {
  describe('POST /staff/auth/register', () => {
    const args = {email: "newstaff@site.com", pass: "secret", staffname: "newuser"};
    
    it('registers new staff', async () => {
      const { body } = await request(server).post('/staff/auth/register').send(args);
      expect(body).toEqual({message: 'Staff account created.'});
    });

    it('does not register already registered staff', async () => {
      const { body } = await request(server).post('/staff/auth/register').send(args);
      expect(body).toEqual({message: 'Staffname already taken.'});
    });
  });

  describe('POST /staff/auth/resend-confirmation-code', () => {
    const args = {email: "newstaff@site.com", pass: "secret"};

    it('resends confirmation code', async () => {
      const { body } = await request(server).post('/staff/auth/resend-confirmation-code').send(args);
      expect(body).toEqual({message: 'Confirmation code re-sent.'});
    });

    it('does not resend to an already verified staff', async () => {
      const { body } = await request(server).post('/staff/auth/resend-confirmation-code').send(args);
      expect(body).toEqual({message: "Already verified."});
    });

    it('does not resend to non-existing staff', async () => {
      const { body } = await request(server).post('/staff/auth/resend-confirmation-code').send({email: "nonstaff@site.com", pass: "secret"});
      expect(body).toEqual({message: "Incorrect email or password."});
    });
  });

  describe('POST /staff/auth/verify', () => {
    const args =    {email: "newstaff@site.com", pass: "secret", confirmationCode: "confirmationCode"};
    const message = "An issue occurred, please double check your info and try again.";

    it('verifies new staff', async () => {
      const { body } = await request(server).post('/staff/auth/verify').send(args);
      expect(body).toEqual({message: 'Staff account verified.'});
    });

    it('does not verify already verified staff', async () => {
      const { body } = await request(server).post('/staff/auth/verify').send(args);
      expect(body).toEqual({message});
    });

    it('does not verify non-existing staff', async () => {
      const { body } = await request(server).post('/staff/auth/resend-confirmation-code').send({email: "nonstaff@site.com", pass: "secret", confirmationCode: "confirmationCode"});
      expect(body).toEqual({message});
    });
  });

  describe('POST /staff/auth/login', () => {  // TO DO: needs setups
    it('logs in existing staff', async () => {
      const { body } = await request(server).post('/staff/auth/login').send({email: "staff@site.com", pass: "secret"});
      expect(body).toEqual({message: 'Signed in.', staffname: "newstaff"});
    });

    it('does not log in already logged in staff', async () => {
      const { body } = await request(server).post('/staff/auth/login').send({email: "loggedinstaff@site.com", pass: "secret"});
      expect(body).toEqual({message: 'Already logged in.'});
    });

    it('does not log in non-existing staff', async () => {
      const { body } = await request(server).post('/staff/auth/login').send({email: "nonstaff@site.com", pass: "secret"});
      expect(body).toEqual({message: "Incorrect email or password."});
    });
  });

  /*describe('POST /staff/auth/logout', () => {  // TO DO: needs setups
    it('logs out existing staff', async () => {
      const { body } = await request(server).post('/staff/auth/logout');
      expect(body).toEqual(1);
    });
  });*/
}