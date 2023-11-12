/*import bcrypt from 'bcrypt';
import * as fs from 'fs';

const encryptedPassword = await bcrypt.hash('01010101-0101-0101-0101-010101010101', 10);

const password_reset_records = [
  {
    "reset_id": "01010101-0101-0101-0101-010101010101",
    "user_id": "33333333-3333-3333-3333-333333333333",
    "temporary_password": encryptedPassword
  }
];

fs.writeFileSync(
  'password-resets.json',
  JSON.stringify(password_reset_records, null, 2),
  'utf-8'
);
console.log('password resets generated');*/
