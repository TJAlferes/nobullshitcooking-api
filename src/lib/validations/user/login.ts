import bcrypt from 'bcrypt';

import { IUser } from '../../../mysql-access/User';

export async function validLogin(
  {
    email,
    pass
  }:
  {
    email: string;
    pass: string;
  },
  user: IUser
) {
  // Problem: This would invalidate some older/alternative email types.
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return {valid: false, feedback: 'Invalid email.'};
  }

  if (pass.length < 6) return {valid: false, feedback: 'Invalid password.'};

  if (pass.length > 54) return {valid: false, feedback: 'Invalid password.'};

  const [ userExists ] = await user.getUserByEmail(email);

  //if (userExists && crypto.timingSafeEqual(userExists[0].email, email))

  if (!userExists.length) {
    return {valid: false, feedback: 'Incorrect email or password.'};
  }

  const isCorrectPassword = await bcrypt.compare(pass, userExists[0].pass);

  if (!isCorrectPassword) {
    return {valid: false, feedback: 'Incorrect email or password.'};
  }

  const notYetConfirmed = userExists[0].confirmation_code !== null;

  if (notYetConfirmed) {
    return {
      valid: false,
      feedback: 'Please check your email for your confirmation code.'
    };
  }
  
  return {valid: true, feedback: 'Valid.', userExists: userExists[0]};
}