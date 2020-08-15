import { IUser } from '../../../mysql-access/User';

export async function validRegister(
  {
    email,
    pass,
    username
  }: {
    email: string;
    pass: string;
    username: string;
  },
  user: IUser
) {
  if (username.length < 6) {
    return {valid: false, feedback: 'Username must be at least 6 characters.'};
  }

  if (username.length > 20) {
    return {
      valid: false,
      feedback: 'Username must be no more than 20 characters.'
    };
  }

  // Problem: This would invalidate some older/alternative email types. Remove?
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return {valid: false, feedback: 'Invalid email.'};
  }

  if (pass.length < 6) {
    return {valid: false, feedback: 'Password must be at least 6 characters.'};
  }

  if (pass.length > 54) {
    return {
      valid: false,
      feedback: 'Password must be no more than 54 characters.'
    };
  }

  const [ userExists ] = await user.getByName(username);
  if (userExists) {
    return {valid: false, feedback: 'Username already taken.'};
  }

  const [ emailExists ] = await user.getByEmail(email);
  if (emailExists) {
    return {valid: false, feedback: 'Email already in use.'};
  }

  return {valid: true, feedback: 'Valid.'};
}