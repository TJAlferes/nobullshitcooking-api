export const test_users = [
  {
    "user_id": "33333333-3333-3333-3333-333333333333",
    "email": "fakeuser1@gmail.com",
    "password": "$2b$10$oGmnjkS8MaCu7BFU3E7k/e5yQhN02.o8xI8iTKNiBeapmp3yyMIJq",
    "username": "FakeUser1",
    "confirmation_code": null
  },
  {
    "user_id": "44444444-4444-4444-4444-444444444444",
    "email": "fakeuser2@gmail.com",
    "password": "$2b$10$NcvU/D1nUIHxYvTxrF7MfudPb4EmW/6xZ2GXY59W6g9gX0MCeQ..y",
    "username": "FakeUser2",
    "confirmation_code": null
  },
  {
    "user_id": "55555555-5555-5555-5555-555555555555",
    "email": "fakeunconfirmeduser1@gmail.com",
    "password": "$2b$10$4D/PF7S3Cjx4U8ZtFTGxZOEtolD5DhmsgwAcI3Z/MzFMNPuDFWeFK",
    "username": "FakeUnconfirmedUser1",
    "confirmation_code": "01010101-0101-0101-0101-010101010101"
  }
].flatMap(row => Object.values(row));
