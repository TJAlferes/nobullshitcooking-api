import bcrypt                        from 'bcrypt';
import { assert, defaulted, object, string } from 'superstruct';
import { ExceptionError } from '../lib/exceptions/exceptions';

// business rules, business logic
// entities, value objects

export function constructEmail(email: string) {
  assert(email, string());
  // Potential issue: This invalidates some older/alternative email types.
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    throw new Error("Invalid email.");
  }
  return email;
}

export function constructPassword(password: string) {
  assert(password, string());
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  if (password.length > 54) {
    throw new Error("Password must be no more than 54 characters.");
  }
  return password;
}

export function constructUsername(username: string) {
  assert(username, string());
  if (username.length < 6) {
    throw new Error("Username must be at least 6 characters.");
  }
  if (username.length > 20) {
    throw new Error("Username must be no more than 20 characters.");
  }
  return username;
}

export function constructConfirmationCode(confirmationCode: string) {
  assert(confirmationCode, defaulted(string(), null));  // IMPORTANT: double check this defaulted to null is not fucking things up
  if (!confirmationCode) return null;
  //const userRepo = new UserRepository(pool);
  //const confirmed = exists.confirmation_code === null;
  //if (!confirmed) return {feedback: "Please check your email for your confirmation code."};
  return confirmationCode;
}

// UserEntity
// don't freeze ?
export function constructUser(params: UserParams) {
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

type UserParams = {
  email:            string;
  password:         string;
  username:         string;
  confirmationCode: string;
};

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
