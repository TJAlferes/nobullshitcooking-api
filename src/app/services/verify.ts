import bcrypt from 'bcrypt';

import { constructEmail, constructPassword, constructConfirmationCode, } from '../../models/User';

export async function verifyService(params: VerifyServiceParams) {

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

  const confirmationCode = constructConfirmationCode(params.confirmationCode);
  const correctConfirmationCode = confirmationCode === user.confirmation_code;
  if (!correctConfirmationCode) {
    throw new Error("An issue occurred, please double check your info and try again.");
  }

  params.userRepo.verify(email);
}

type VerifyServiceParams = {
  email:            string;
  password:         string;
  confirmationCode: string;
  //userRepo:         
};
