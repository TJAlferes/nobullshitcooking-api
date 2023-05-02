import bcrypt           from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { emailConfirmationCode } from './email-confirmation-code';

export async function createUserService({
  email,
  password,
  username,
  userRepo
}) {
  const encryptedPassword = await bcrypt.hash(password, 10);

  const confirmationCode = uuidv4();

  const user = constructUser({
    email,
    password: encryptedPassword,
    username,
    confirmationCode
  });
    
  await userRepo.create(user);

  // emailService ?
  emailConfirmationCode(email, confirmationCode);
}
