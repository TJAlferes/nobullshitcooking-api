import bcrypt from 'bcryptjs';

import { UnauthorizedException } from '../../../../utils/exceptions';
import { emailUser } from '../../../aws-ses/service';
import { PasswordResetRepoInterface } from './repo';
import { UserService } from '../../service';

export class PasswordResetService {
  private readonly repo: PasswordResetRepoInterface;

  constructor(repo: PasswordResetRepoInterface) {
    this.repo = repo;
  }

  async resetPassword({
    user_id,
    temporary_password,
    new_password,
    userService
  }: ResetPasswordParams) {
    await this.isCorrectTemporaryPassword({user_id, temporary_password});
    // TO DO: consider making the update and delete a single transaction
    await userService.resetPassword({user_id, new_password});
    await this.repo.deleteByUserId(user_id);
  }

  async isCorrectTemporaryPassword({
    user_id,
    temporary_password
  }: IsCorrectTemporaryPasswordParams) {
    const currentHash = await this.repo.getPassword(user_id);
    if (!currentHash) {
      throw new UnauthorizedException('Incorrect email or temporary password.');
    }

    const correctTemporaryPassword = await bcrypt.compare(temporary_password, currentHash);
    if (!correctTemporaryPassword) {
      throw new UnauthorizedException('Incorrect email or temporary password.');
    }
  }

  async sendTemporaryPassword({ email, temporary_password }: SendTemporaryPasswordParams) {
    const charset  = 'UTF-8';
    const from     = 'No Bullshit Cooking <noreply@nobullshitcooking.com>';
    const to       = email;
    const subject  = 'Temporary Password For No Bullshit Cooking';
    const bodyText = 'Temporary Password For No Bullshit Cooking\r\n'
      + 'Please enter the following temporary password at:\r\n'
      + 'https://nobullshitcooking.com/reset-password\r\n'
      + temporary_password;
    const bodyHtml = `
      <html>
      <head></head>
      <body>
        <h1>Temporary Password For No Bullshit Cooking</h1>
        <p>Please enter the following temporary password at:</p>
        <p>https://nobullshitcooking.com/reset-password</p>
        ${temporary_password}
      </body>
      </html>
    `;

    await emailUser({from, to, subject, bodyText, bodyHtml, charset});
  }
}

type ResetPasswordParams = {
  user_id:            string;
  temporary_password: string;
  new_password:       string;
  userService:        UserService;
};

type IsCorrectTemporaryPasswordParams = {
  user_id:            string;
  temporary_password: string;
};

type SendTemporaryPasswordParams = {
  email:              string;
  temporary_password: string;
};
