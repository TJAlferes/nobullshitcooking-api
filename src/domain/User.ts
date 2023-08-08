import { assert, defaulted, object, string } from 'superstruct';

import { Id, GenerateId } from './shared';

export class User {
  private readonly id;
  private email;
  private password;
  private username;
  private confirmationCode;
  // Timestamps -- handled by MySQL
  private created_at: Date | null = null;
  private updated_at: Date | null = null;
  //private events: DomainEvent = [];

  private constructor(params: UserEntity) {
    this.id               = Id(params.id);
    this.email            = Email(params.email);
    this.password         = Password(params.password);
    this.username         = Username(params.username);
    this.confirmationCode = Id(params.confirmationCode);
  }

  static create(params: UserParams): User {
    const id               = GenerateId();
    const confirmationCode = GenerateId();
    const user             = new User({...params, id, confirmationCode});
    //const userCreatedEvent = new UserCreatedEvent(user.userId);
    //this.events.push(userCreatedEvent);
    return user;
  }

  commandMethod(input, context) {
    // validate args, validate state transitions, record domain events
  }
  //setters

  // these go into repo:
  //update
  //delete

  queryMethod(): ReturnType {

  }

  load(params: UserEntity): User {
    return new User(params);
  }

  //getters
  getEmail() {
    return this.email;
  }

  getUsername() {
    return this.username;
  }

  getConfirmationCode() {
    return this.confirmationCode;
  }

  // these go into repo:
  //getById        (INTERNAL ONLY, read model)
  //getByEmail     (INTERNAL ONLY, read model)
  //getByUsername  (INTERNAL ONLY, read model)
  //viewByEmail    (EXTERNAL, view model)
  //viewByUsername (EXTERNAL, view model)

  //releaseEvents(): Event[] { return recorded domain events }
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

export type UserParams = {
  email:            string;
  password:         string;
  username:         string;
};

export type UserEntity = UserParams & {
  id:               string;
  confirmationCode: string;
};

/*export const validUpdatingUser = object({
  email:    string(),
  pass:     string(),
  username: string()
});*/
