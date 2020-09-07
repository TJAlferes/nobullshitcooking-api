import bcrypt from 'bcrypt';

import { IStaff } from '../../../mysql-access/Staff';

export async function validLogin({email, pass}: Info, staff: IStaff) {
  // Problem: This would invalidate some older/alternative email types.
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return {valid: false, feedback: 'Invalid email.'};
  }

  if (pass.length < 6) return {valid: false, feedback: 'Invalid password.'};

  if (pass.length > 54) return {valid: false, feedback: 'Invalid password.'};

  const [ staffExists ] = await staff.getByEmail(email);
  //crypto.timingSafeEqual()
  if (!staffExists) {
    return {valid: false, feedback: 'Incorrect email or password.'};
  }
  
  const isCorrectPassword = await bcrypt.compare(pass, staffExists.pass);
  if (!isCorrectPassword) {
    return {valid: false, feedback: 'Incorrect email or password.'};
  }

  return {valid: true, feedback: 'Valid.', staffExists};
}

type Info = {
  email: string;
  pass: string;
};