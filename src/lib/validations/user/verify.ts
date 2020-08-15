import bcrypt from 'bcrypt';

import { IUser } from '../../../mysql-access/User';

export async function validVerify(
  {
    email,
    pass,
    confirmationCode
  }: {
    email: string;
    pass: string;
    confirmationCode: string;
  },
  user: IUser
) {
  // Problem: This would invalidate some older/alternative email types.
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return {valid: false, feedback: 'Invalid email.'};
  }

  if (pass.length < 6) return {valid: false, feedback: 'Invalid password.'};

  if (pass.length > 54) return {valid: false, feedback: 'Invalid password.'};

  const [ emailExists ] = await user.getByEmail(email);
  if (!emailExists) {
    return {
      valid: false,
      feedback: 'An issue occurred, please double check your info and try again.'
    };
  }

  const isCorrectPassword = await bcrypt.compare(pass, emailExists.pass);
  if (!isCorrectPassword) {
    return {valid: false, feedback: 'Incorrect email or password.'};
  }
  
  if (emailExists.confirmation_code !== confirmationCode) {
    return {
      valid: false,
      feedback: 'An issue occurred, please double check your info and try again.'
    };
  }

  return {valid: true, feedback: 'Valid.'};
}