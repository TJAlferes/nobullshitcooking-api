import bcrypt from 'bcrypt';

import { ModifiedSession }       from '../../../app';
import { UUIDv7StringId }        from '../../shared/model';
import { emailUser }             from '../shared/simple-email-service';
import { Email, Password, User } from '../model';
import { UserRepoInterface }     from '../repo';
//crypto.timingSafeEqual() ???

export class UserAuthenticationService {
  private readonly repo: UserRepoInterface;

  constructor(repo: UserRepoInterface) {
    this.repo = repo;
  }

  async isUserConfirmed(email: string) {
    const validEmail = Email(email);
    const user = await this.repo.getByEmail(validEmail);
    return user.confirmation_code === null;
  }

  async hashPassword(password: string) {
    const validPassword = Password(password);
    const encryptedPassword = await bcrypt.hash(validPassword, 10);
    return encryptedPassword;
  }

  async isCorrectPassword(params: IsCorrectPasswordParams) {
    const email    = Email(params.email);
    const password = Password(params.password);

    const currentHash = await this.repo.getPassword(email);
    const correctPassword = await bcrypt.compare(password, currentHash);
    if (!correctPassword) {
      throw new Error("Incorrect email or password.");
    }
  }

  async doesUserExist(email: string) {
    const validEmail = Email(email);
    const user = await this.repo.getByEmail(validEmail);
    if (!user) {
      throw new Error("Incorrect email or password.");
    }
    return user;
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
    const user = await this.doesUserExist(email);

    const confirmed = await this.isUserConfirmed(email);
    if (confirmed) {
      throw new Error("Already confirmed.");
    }

    await this.isCorrectPassword({email, password});
  
    await this.sendConfirmationCode({
      email:             user.email,
      confirmation_code: user.confirmation_code
    });
  }

  async login({ email, password, session }: LoginParams) {
    const { user_id, username } = await this.doesUserExist(email);

    const confirmed = await this.isUserConfirmed(email);
    if (!confirmed) {
      throw new Error("Please check your email for your confirmation code.");
    }

    await this.isCorrectPassword({email, password});

    session.user_id  = user_id;
    session.username = username;
  
    return username;
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

type IsCorrectPasswordParams = {
  email:    string;
  password: string;
};

type LoginParams = {
  email:    string;
  password: string;
  session:  ModifiedSession;
};
