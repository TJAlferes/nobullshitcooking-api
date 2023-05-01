import bcrypt                        from 'bcrypt';
import { defaulted, object, string } from 'superstruct';
import { ExceptionError } from '../lib/exceptions/exceptions';
import { UserRepository } from '../access/mysql';

import {
any,
array,
assert,
assign,
bigint,
boolean,
coerce,
create,
date,
defaulted,
define,
deprecated,
dynamic,
empty,
enums,
func,
instance,
integer,
intersection,
is,
lazy,
literal,
map,
mask,
max,
min,
never,
nonempty,
nullable,
number,
object,
omit,
optional,
partial,
pattern,
pick,
record,
refine,
regexp,
set,
size,
string,
trimmed,
tuple,
type,
union,
unknown,
validate
} from 'superstruct';

// business rules, business logic

type UserParams = {
  email:            string;
  password:         string;
  username:         string;
  confirmationCode: string;
};

async function constructEmail(email: string) {
  // Potential issue: This invalidates some older/alternative email types.
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    throw new Error("Invalid email.");
  }
  const userRepo = new UserRepository(pool);
  const emailExists = await userRepo.getByEmail(email);
  if (emailExists) {
    throw new Error("Email already in use.");
  }
  return email;
}

function constructPassword(password: string) {
  if (password.length < 6 || password.length > 54) {
    throw new Error("Invalid password.");
  }
  return password;
}

async function constructUsername(username: string) {
  if (username.length < 6 || username.length > 54) {
    throw new Error("Invalid username.");
  }
  const userRepo = new UserRepository(pool);
  const nameExists = await userRepo.getByName(username);
  if (nameExists) {
    throw new Error("Name already taken.");
  }
  return username;
}

function constructConfirmationCode(confirmationCode: string) {
  if (!confirmationCode) return null;
  return confirmationCode;
}

export function constructUser(params: UserParams) {
  assert(params, User);
  const email =            constructEmail(params.email);
  const password =         constructPassword(params.password);
  const username =         constructUsername(params.username);
  const confirmationCode = constructConfirmationCode(params.confirmationCode);
  return Object.freeze({
    email,
    password,
    username,
    confirmationCode
  });
}

export const User = object({
  email:            string(),
  password:         string(),
  username:         string(),
  confirmationCode: defaulted(string(), null)
});

export const validUpdatingUser = object({
  email:    string(),
  pass:     string(),
  username: string()
});

// Login

export const validLoginRequest = object({
  email: string(),
  pass:  string()
});

export async function validLogin({ email, pass }: LoginParams, access: IUser) {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return {feedback: "Invalid email."};
  if (pass.length < 6)                                         return {feedback: "Invalid password."};
  if (pass.length > 54)                                        return {feedback: "Invalid password."};

  const exists = await access.getByEmail(email);
  //crypto.timingSafeEqual() ???
  if (!exists) return {feedback: "Incorrect email or password."};
  
  const correctPassword = await bcrypt.compare(pass, exists.pass);
  if (!correctPassword) return {feedback: "Incorrect email or password."};

  const confirmed = exists.confirmation_code === null;
  if (!confirmed) return {feedback: "Please check your email for your confirmation code."};

  return {feedback: "valid", exists};
}

// Register

export const validUserRegisterRequest = object({
  email:    string(),
  pass:     string(),
  username: string()
});

export async function validRegister({ email, pass, name }: RegisterParams, access: IUser) {
  // Problem: This would invalidate some older/alternative email types. Remove?
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return "Invalid email.";
  if (name.length < 6)                                         return "Name must be at least 6 characters.";
  if (name.length > 20)                                        return "Name must be no more than 20 characters.";
  if (pass.length < 6)                                         return "Password must be at least 6 characters.";
  if (pass.length > 54)                                        return "Password must be no more than 54 characters.";

  const nameExists = await access.getByName(name);
  if (nameExists) throw new Error("Name already taken.");

  const emailExists = await access.getByEmail(email);
  if (emailExists) throw new Error("Email already in use.");

  return true;
}

// Resend Confirmation Code

export const validResendRequest = object({
  email: string(),
  pass: string()
});

export async function validResend({ email, pass }: ResendParams, access: IUser) {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return "Invalid email.";
  if (pass.length < 6)                                         return "Invalid password.";
  if (pass.length > 54)                                        return "Invalid password.";

  const exists = await access.getByEmail(email);
  //crypto.timingSafeEqual(exists.email, email) ???
  if (!exists) return "Incorrect email or password.";

  const correctPassword = await bcrypt.compare(pass, exists.pass);
  if (!correctPassword) return "Incorrect email or password.";

  const confirmed = exists.confirmation_code === null;
  if (confirmed) return "Already verified.";

  return "valid";
}

// Verify

export const validVerifyRequest = object({
  email:            string(),
  pass:             string(),
  confirmationCode: string()
});

export async function validVerify({ email, pass, confirmationCode }: VerifyParams, access: IUser) {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return "Invalid email.";
  if (pass.length < 6)                                         return "Invalid password.";
  if (pass.length > 54)                                        return "Invalid password.";

  const exists = await access.getByEmail(email);
  if (!exists) return "An issue occurred, please double check your info and try again.";

  const correctPassword = await bcrypt.compare(pass, exists.pass);
  if (!correctPassword) return "Incorrect email or password.";
  
  if (exists.confirmation_code !== confirmationCode) return "An issue occurred, please double check your info and try again.";

  return "valid";
}

type LoginParams = {
  email: string;
  pass:  string;
};

type RegisterParams = {
  email: string;
  pass:  string;
  name:  string;
};

type ResendParams = {
  email: string;
  pass:  string;
};

type VerifyParams = {
  email: string;
  pass:  string;
  confirmationCode: string;
};
