import { assert, string } from 'superstruct';

import { UUIDv7StringId, GenerateUUIDv7StringId } from '../shared/model';

export class User {
  private readonly user_id;
  private email;
  private password;  // encrypted/hashed, not raw request body payload
  private username;
  private confirmation_code;
  //private events: DomainEvent = [];

  private constructor(params: ConstructorParams) {
    this.user_id           = UUIDv7StringId(params.user_id);
    this.email             = Email(params.email);
    this.password          = Password(params.password);
    this.username          = Username(params.username);

    this.confirmation_code = params.confirmation_code === null
      ? null
      : UUIDv7StringId(params.confirmation_code);
  }

  static create(params: CreateParams): User {
    const user_id           = GenerateUUIDv7StringId();
    const confirmation_code = GenerateUUIDv7StringId();
    const user = new User({...params, user_id, confirmation_code});
    //const event = new UserCreatedEvent(user.getId());  // email?
    //this.events.push(event);
    return user;
  }

  static update(params: UpdateParams): User {
    const user = new User(params);
    //const event = new UserUpdatedEvent(user.getId());  // email?
    //this.events.push(event);
    return user;
  }

  getDTO() {
    return {
      user_id:           this.user_id,
      email:             this.email,
      password:          this.password,
      username:          this.username,
      confirmation_code: this.confirmation_code
    };
  }

  /*commandMethod(input, context) {
    // validate args, validate state transitions, record domain events
  }
  queryMethod(): ReturnType {}
  releaseEvents(): DomainEvent[] {
    // return recorded domain events
  }*/
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

export type CreateParams = {
  email:    string;
  password: string;
  username: string;
};

export type UpdateParams = CreateParams & {
  user_id:           string;
  confirmation_code: string | null;
};

export type ConstructorParams = UpdateParams;
