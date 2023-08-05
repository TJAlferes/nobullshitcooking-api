import bcrypt from 'bcrypt';

import { constructEmail, constructPassword } from '../../models/User';

//crypto.timingSafeEqual() ???

export async function loginService(params: LoginServiceParams) {
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
  if (!confirmed) {
    throw new Error("Please check your email for your confirmation code.");
  }

  return {
    id:       user.id,
    username: user.username
  };
}

type LoginServiceParams = {
  email:    string;
  password: string;
  //userRepo: ;
};
