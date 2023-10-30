import bcrypt from 'bcrypt';
import * as fs from 'fs';
import { uuidv7 } from 'uuidv7';

const data = [
  [
    "00000000-0000-0000-0000-000000000000",
    "nobscunknown@gmail.com",
    "fakepassword",
    "Unknown"
  ],
  [
    "11111111-1111-1111-1111-111111111111",
    "nobsc@nobullshitcooking.com",
    "fakepassword",
    "NOBSC"
  ],
  [
    "22222222-2222-2222-2222-222222222222",
    "nobsctester@gmail.com",
    "fakepassword",
    "Tester"
  ],
  [
    "33333333-3333-3333-3333-333333333333",
    "fakeuser1@gmail.com",
    "fakepassword",
    "FakeUser1"
  ],
  [
    "44444444-4444-4444-4444-444444444444",
    "fakeuser2@gmail.com",
    "fakepassword",
    "FakeUser2"
  ]
];

const image_records = [];
const user_records = [];
const user_image_records = [];

for (const row of data) {
  const [
    user_id,
    email,
    password,
    username
  ] = row;
  const image_id = uuidv7();  // TO DO: default user avatar
  const encryptedPassword = await bcrypt.hash(password, 10);

  image_records.push({
    image_id,
    image_filename: username,
    caption: username,
    author_id: user_id,
    owner_id: user_id
  });

  user_records.push({
    user_id,
    email,
    password: encryptedPassword,
    username,
    confirmation_code: null
  });

  user_image_records.push({
    user_id,
    image_id,
    current: true
  });
}

user_records.push({
  user_id: "55555555-5555-5555-5555-555555555555",
  email: "fakeunconfirmeduser1@gmail.com",
  password: "fakepassword",
  username: "FakeUnconfirmedUser1",
  confirmation_code: "01010101-0101-0101-0101-010101010101"
});

fs.writeFileSync(
  'generated-images.json',
  JSON.stringify(image_records, null, 2),
  'utf-8'
);

console.log('images generated');

fs.writeFileSync(
  'generated-users.json',
  JSON.stringify(user_records, null, 2),
  'utf-8'
);

console.log('users generated');

fs.writeFileSync(
  'generated-user-images.json',
  JSON.stringify(user_image_records, null, 2),
  'utf-8'
);

console.log('user images generated');
