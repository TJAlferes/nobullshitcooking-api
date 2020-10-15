import { IStaff } from '../../../access/mysql/Staff';

export async function validRegister(
  {email, pass, staffname}: Info,
  staff: IStaff
) {
  if (staffname.length < 6) {
    return {valid: false, feedback: 'Staffname must be at least 6 characters.'};
  }

  if (staffname.length > 20) {
    return {
      valid: false,
      feedback: 'Staffname must be no more than 20 characters.'
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

  const [ staffExists ] = await staff.getByName(staffname);
  if (staffExists) return {valid: false, feedback: 'Staffname already taken.'};

  const [ emailExists ] = await staff.getByEmail(email);
  if (emailExists) return {valid: false, feedback: 'Email already in use.'};

  return {valid: true, feedback: 'Valid.'};
}

type Info = {
  email: string;
  pass: string;
  staffname: string;
};