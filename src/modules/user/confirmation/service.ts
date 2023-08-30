import bcrypt     from 'bcrypt';
import { uuidv7 } from 'uuidv7';

import { UUIDv7StringId }        from '../../shared/model';
import { Email, Password, User } from '../model';
import { UserRepoInterface }     from '../repo';
import { emailUser }             from '../shared/simple-email-service';
import { UserAuthenticationService } from '../authentication/service';
//crypto.timingSafeEqual() ???

export class UserConfirmationService {
  private readonly repo: UserRepoInterface;

  constructor(repo: UserRepoInterface) {
    this.repo = repo;
  }

  async confirm(confirmation_code: string) {
    const code = UUIDv7StringId(confirmation_code);
    if (!code) {
      throw new Error("An issue occurred, please double check your info and try again.");
    }

    const existingUser = await this.repo.getByConfirmationCode(code);

    if (null === existingUser.confirmation_code) {
      throw new Error("Already confirmed.");
    }

    if (code !== existingUser.confirmation_code) {
      throw new Error("An issue occurred, please double check your info and try again.");
    }

    const password = await this.repo.getPassword(existingUser.email);

    const user = User.update({
      user_id:           existingUser.user_id,
      email:             existingUser.email,
      password,
      username:          existingUser.username,
      confirmation_code: null
    }).getDTO();

    await this.repo.update(user);
  }

  async sendConfirmationCode({ email, confirmation_code }: SendConfirmationCodeParams) {
    const charset  = "UTF-8";
    const from     = "No Bullshit Cooking <staff@nobullshitcooking.com>";
    const to       = email;
    const subject  = "Confirmation Code For No Bullshit Cooking";
    const bodyText = "Confirmation Code For No Bullshit Cooking\r\n"
      + "Please enter the following confirmation code at:\r\n"
      + "https://nobullshitcooking.com/verify\r\n"
      + confirmation_code;
    const bodyHtml = `
      <html>
      <head></head>
      <body>
        <h1>Confirmation Code For No Bullshit Cooking</h1>
        <p>Please enter the following confirmation code at:</p>
        <p>https://nobullshitcooking.com/verify</p>
        ${confirmation_code}
      </body>
      </html>
    `;

    await emailUser({from, to, subject, bodyText, bodyHtml, charset});
  }
  
  async resendConfirmationCode({ email, password }: ResendConfirmationCodeParams) {
    const {
      doesUserExist,
      isCorrectPassword,
      isUserConfirmed
    } = new UserAuthenticationService(this.repo);

    const user = await doesUserExist(email);

    const confirmed = await isUserConfirmed(email);
    if (confirmed) {
      throw new Error("Already confirmed.");
    }

    await isCorrectPassword({email, password});
  
    await this.sendConfirmationCode({
      email:             user.email,
      confirmation_code: user.confirmation_code
    });
  }
}

type SendConfirmationCodeParams = {
  email:             string;
  confirmation_code: string;
};

type ResendConfirmationCodeParams = {
  email:    string;
  password: string;
};
