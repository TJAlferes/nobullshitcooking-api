import { IUser } from '../../../mysql-access/User';

export async function validVerify(
  {
    email,
    confirmationCode
  }:
  {
    email: string;
    confirmationCode: string;
  },
  user: IUser
) {
  const emailExists = await user.getUserByEmail(email);

  if (!emailExists.length) {
    return {
      valid: false,
      feedback: 'An issue occurred, please double check your info and try again.'
    };
  }
  
  if (emailExists[0].confirmation_code !== confirmationCode) {
    return {
      valid: false,
      feedback: 'An issue occurred, please double check your info and try again.'
    };
  }

  return {valid: true, feedback: 'Valid.'};
}