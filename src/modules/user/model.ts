import { assert, string } from 'superstruct';

import { ValidationException } from '../../utils/exceptions.js';
import { UUIDv7StringId, GenerateUUIDv7StringId } from '../shared/model.js';

export class User {
  private readonly user_id;
  private email;
  private password;  // encrypted/hashed, not raw request body payload
  private username;
  private confirmation_code;

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
    return new User({...params, user_id, confirmation_code});
  }

  static update(params: UpdateParams): User {
    return new User(params);
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
}

export function Email(email: string) {
  assert(email, string());
  // Potential issue: This invalidates some older/alternative email types.
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    throw ValidationException("Invalid email.");
  }
  return email;
}

export function Password(password: string) {
  assert(password, string());
  if (password.length < 6) {
    throw ValidationException("Password must be at least 6 characters.");
  }
  if (password.length > 60) {
    throw ValidationException("Password must be no more than 60 characters.");
  }
  return password;
}

export function Username(username: string) {
  assert(username, string());
  if (username.length < 6) {
    throw ValidationException("Username must be at least 6 characters.");
  }
  if (username.length > 20) {
    throw ValidationException("Username must be no more than 20 characters.");
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
