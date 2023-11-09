import { UUIDv7StringId, GenerateUUIDv7StringId } from '../../../shared/model.js';
import { Password } from '../../model.js';

export class PasswordReset {
  private reset_id;
  private user_id;
  private temporary_password;  // encrypted/hashed, not raw request body payload

  private constructor(params: ConstructorParams) {
    this.reset_id           = UUIDv7StringId(params.reset_id);
    this.user_id            = UUIDv7StringId(params.user_id);
    this.temporary_password = Password(params.temporary_password);
  }

  static create(user_id: string): PasswordReset {
    const reset_id           = GenerateUUIDv7StringId();
    const temporary_password = GenerateUUIDv7StringId();
    return new PasswordReset({reset_id, user_id, temporary_password});
  }

  getDTO() {
    return {
      reset_id:           this.reset_id,
      user_id:            this.user_id,
      temporary_password: this.temporary_password
    };
  }
}

export type ConstructorParams = {
  reset_id: string;
  user_id:  string;
  temporary_password: string;
};
