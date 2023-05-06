import bcrypt           from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { constructEmail, constructPassword, constructUsername, constructUser } from '../../models/User';
import { emailConfirmationCode } from './email-confirmation-code';

export async function createUserService(params: CreateUserServiceParams) {
  const email = constructEmail(params.email);
  const emailExists = await params.userRepo.getByEmail(email);
  if (emailExists) {
    throw new Error("Email already in use.");
  }

  const username = constructUsername(params.username);
  const nameExists = await params.userRepo.getByName(username);
  if (nameExists) {
    throw new Error("Username already in use.");
  }

  const password = constructPassword(params.password);
  const encryptedPassword = await bcrypt.hash(password, 10);
  const confirmationCode = uuidv4();
  const user = constructUser({
    email,
    password: encryptedPassword,
    username,
    confirmationCode
  });
  
  await params.userRepo.create(user);

  // emailService ?
  emailConfirmationCode(email, confirmationCode);
}

type CreateUserServiceParams = {
  email:    string;
  password: string;
  username: string;
  //userRepo: ;
};
