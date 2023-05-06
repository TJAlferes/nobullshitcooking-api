import bcrypt           from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { constructEmail, constructPassword } from '../../models/User';
import { emailConfirmationCode }             from './email-confirmation-code';

//crypto.timingSafeEqual(exists.email, email) ???

export async function resendConfirmationCodeService(params: ResendConfirmationCodeServiceParams) {
  const email = constructEmail(params.email);
  const user = await params.userRepo.getByEmail(email);
  if (!user) {
    throw new Error("Incorrect email or password.");
  }

  const password = constructPassword(params.password);
  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    throw new Error("Incorrect email or password.");
  }

  const confirmed = user.confirmation_code === null;  // IMPORTANT: double check your struct is not fucking with this
  if (confirmed) {
    throw new Error("Already verified.");
  }

  const confirmationCode = uuidv4();
  emailConfirmationCode(email, confirmationCode);
}

type ResendConfirmationCodeServiceParams = {
  email:    string;
  password: string;
  //userRepo: ;
};
