import bcrypt from 'bcrypt';

import { IStaff } from '../../../access/mysql/Staff';

export async function validLogin({email, pass}: Info, staff: IStaff) {
  // Problem: This would invalidate some older/alternative email types.
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return {feedback: "Invalid email."};
  }
  if (pass.length < 6) return {feedback: "Invalid password."};
  if (pass.length > 54) return {feedback: "Invalid password."};

  const staffExists = await staff.getByEmail(email);
  //crypto.timingSafeEqual() ???
  if (!staffExists) return {feedback: "Incorrect email or password."};
  
  const correctPassword = await bcrypt.compare(pass, staffExists.pass);
  if (!correctPassword) return {feedback: "Incorrect email or password."};

  return {feedback: "valid", staffExists};
}

type Info = {
  email: string;
  pass: string;
};