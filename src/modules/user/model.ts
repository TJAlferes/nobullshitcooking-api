import { assert, string } from 'superstruct';

import { ValidationException } from '../../utils/exceptions';
import { UUIDv7StringId, GenerateUUIDv7StringId } from '../shared/model';

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
    const confirmation_code = GenerateUUIDv7StringId();  // TO DO: use a cryptographically secure string instead
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
  if (email.length < 5) {
    throw new ValidationException('Email must be at least 5 characters.');
  }
  if (email.length > 60) {
    throw new ValidationException('Email must be no more than 60 characters.');
  }
  // Potential issue: This invalidates some older/alternative email types.
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    throw new ValidationException('Invalid email.');
  }
  return email;
}

export function Password(password: string) {
  assert(password, string());
  if (password.length < 8) {
    throw new ValidationException('Password must be at least 8 characters.');
  }
  if (password.length > 64) {
    throw new ValidationException('Password must be no more than 64 characters.');
  }
  return password;
}

export function Username(username: string) {
  assert(username, string());
  const name = username.slice().trim().replace(/\s/g, '');
  if (username.length !== name.length) {
    throw new ValidationException('Username may not have spaces.');
  }
  if (name.length < 6) {
    throw new ValidationException('Username must be at least 6 characters.');
  }
  if (name.length > 20) {
    throw new ValidationException('Username must be no more than 20 characters.');
  }
  return name;
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
