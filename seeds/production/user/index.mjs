import bcrypt from 'bcrypt';
import { uuidv7 } from 'uuidv7';
import * as fs from 'fs';

const encryptedPassword = await bcrypt.hash(validPassword, 10);

const data = [
  [
    "00000000-0000-0000-0000-000000000000",
    "unknownnobsc@gmail.com",
    "fakepassword",
    "Unknown"
  ],
  [
    "11111111-1111-1111-1111-111111111111",
    "nobsc@nobullshitcooking.com",
    "fakepassword",
    "NOBSC"
  ]
];

const image_records = [];
const user_records = [];
const user_image_records = [];

data.map(async ([
  user_id,
  email,
  password,
  username
]) => {
  const image_id = uuidv7();
  const encryptedPassword = await bcrypt.hash(password, 10);

  image_records.push({
    image_id,
    image_filename: uuidv7(),
    caption: username,
    author_id: user_id,
    owner_id: user_id
  });

  user_records.push({
    user_id,
    email,
    password: encryptedPassword,
    username,
    confirmation_code: uuidv7()
  });

  user_image_records.push({
    user_id,
    image_id,
    current: true
  });
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
