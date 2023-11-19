import bcrypt from 'bcrypt';

import { UnauthorizedException } from '../../../../utils/exceptions';
import { emailUser } from '../../../aws-ses/service';
import { Email } from '../../model';
import { PasswordResetRepoInterface } from './repo';

export class PasswordResetService {
  private readonly repo: PasswordResetRepoInterface;

  constructor(repo: PasswordResetRepoInterface) {
    this.repo = repo;
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
    const from     = 'No Bullshit Cooking <staff@nobullshitcooking.com>';
    const to       = email;
    const subject  = 'Temporary Password For No Bullshit Cooking';
    const bodyText = 'Temporary Password For No Bullshit Cooking\r\n'
      + 'Please enter the following temporary password at:\r\n'
      + 'https://nobullshitcooking.com/login\r\n'
      + temporary_password;
    const bodyHtml = `
      <html>
      <head></head>
      <body>
        <h1>Temporary Password For No Bullshit Cooking</h1>
        <p>Please enter the following temporary password at:</p>
        <p>https://nobullshitcooking.com/login</p>
        ${temporary_password}
      </body>
      </html>
    `;

    await emailUser({from, to, subject, bodyText, bodyHtml, charset});
  }
}

type IsCorrectTemporaryPasswordParams = {
  user_id:            string;
  temporary_password: string;
};

type SendTemporaryPasswordParams = {
  email:              string;
  temporary_password: string;
};
