import { UUIDv7StringId, GenerateUUIDv7StringId } from '../../../shared/model.js';
import { Password } from '../../model.js';

export class PasswordReset {
  private reset_id;
  private user_id;
  private temporary_password;  // encrypted/hashed

  private constructor(params: ConstructorParams) {
    this.reset_id           = UUIDv7StringId(params.reset_id);
    this.user_id            = UUIDv7StringId(params.user_id);
    this.temporary_password = Password(params.temporary_password);
  }

  static create(params: CreateParams): PasswordReset {
    const reset_id = GenerateUUIDv7StringId();
    return new PasswordReset({reset_id, ...params});
  }

  getDTO() {
    return {
      reset_id:           this.reset_id,
      user_id:            this.user_id,
      temporary_password: this.temporary_password
    };
  }
}

export type CreateParams = {
  user_id:            string;
  temporary_password: string;
};

export type ConstructorParams = CreateParams & {
  reset_id: string;
};
