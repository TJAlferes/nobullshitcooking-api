import { assert, defaulted, object, string } from 'superstruct';
import { v4 as uuidv4 }                      from 'uuid';

export class User {
  private userId;
  private email;
  private password;
  private username;
  private confirmationCode;
  //private events: DomainEvent = [];

  private constructor(params: UserParams) {
    this.userId           = UserId();
    this.email            = Email(params.email);
    this.password         = Password(params.password);
    this.username         = Username(params.username);
    this.confirmationCode = ConfirmationCode(params.confirmationCode);
  }

  static create(params: UserParams): User {
    const user             = new User(params);
    //const userCreatedEvent = new UserCreatedEvent(user.userId);
    //this.events.push(userCreatedEvent);
    return user;
  }

  commandMethod(input, context) {
    // validate args, validate state transitions, record domain events
  }

  queryMethod(): ReturnType {

  }

  //releaseEvents(): Event[] { return recorded domain events }
}

export function UserId() {
  return uuidv4();
}
 
export function Email(email: string) {
  assert(email, string());
  // Potential issue: This invalidates some older/alternative email types.
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    throw new Error("Invalid email.");
  }
  return email;
}

export function Password(password: string) {
  assert(password, string());
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  if (password.length > 54) {
    throw new Error("Password must be no more than 54 characters.");
  }
  return password;
}

export function Username(username: string) {
  assert(username, string());
  if (username.length < 6) {
    throw new Error("Username must be at least 6 characters.");
  }
  if (username.length > 20) {
    throw new Error("Username must be no more than 20 characters.");
  }
  return username;
}

export function ConfirmationCode(confirmationCode: string) {
  assert(confirmationCode, defaulted(string(), null));  // IMPORTANT: double check this defaulted to null is not fucking things up
  if (!confirmationCode) return null;
  //const userRepo = new UserRepository(pool);
  //const confirmed = exists.confirmation_code === null;
  //if (!confirmed) return {feedback: "Please check your email for your confirmation code."};
  return confirmationCode;
}

type UserParams = {
  email:            string;
  password:         string;
  username:         string;
  confirmationCode: string;
};

export const validUpdatingUser = object({
  email:    string(),
  pass:     string(),
  username: string()
});
