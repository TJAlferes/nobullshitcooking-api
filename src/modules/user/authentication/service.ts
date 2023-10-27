import bcrypt from 'bcrypt';

import { ConflictException, NotFoundException, UnauthorizedException } from '../../../utils/exceptions.js';
import { UUIDv7StringId }        from '../../shared/model.js';
import { emailUser }             from '../shared/simple-email-service.js';
import { Email, Password, User } from '../model.js';
import { UserRepoInterface }     from '../repo.js';
//crypto.timingSafeEqual() ???

export class UserAuthenticationService {
  private readonly repo: UserRepoInterface;

  constructor(repo: UserRepoInterface) {
    this.repo = repo;
  }

  async resendConfirmationCode({ email, password }: ResendConfirmationCodeParams) {
    const user = await this.doesUserExist(email);

    const confirmed = await this.isUserConfirmed(email);
    if (confirmed) throw ConflictException("Already confirmed.");

    await this.isCorrectPassword({email, password});
  
    await this.sendConfirmationCode({
      email:             user.email,
      confirmation_code: user.confirmation_code!
    });
  }

  async confirm(confirmation_code: string) {
    const code = UUIDv7StringId(confirmation_code);

    const existingUser = await this.repo.getByConfirmationCode(code);
    if (!existingUser) {
      throw NotFoundException("An issue occurred, please double check your info and try again.");
    }

    if (null === existingUser.confirmation_code) {
      throw ConflictException("Already confirmed.");
    }

    if (code !== existingUser.confirmation_code) {
      throw NotFoundException("An issue occurred, please double check your info and try again.");
    }

    const password = await this.repo.getPassword(existingUser.email);
    if (!password) {
      throw NotFoundException("An issue occurred, please double check your info and try again.");
    }

    const user = User.update({
      user_id:           existingUser.user_id,
      email:             existingUser.email,
      password,
      username:          existingUser.username,
      confirmation_code: null  // setting their code to null confirms them
    }).getDTO();

    await this.repo.update(user);
  }

  async login({ email, password }: LoginParams) {
    const { user_id, username } = await this.doesUserExist(email);

    const confirmed = await this.isUserConfirmed(email);
    if (!confirmed) {
      throw UnauthorizedException("Please check your email for your confirmation code.");
    }

    await this.isCorrectPassword({email, password});
  
    return {
      user_id,
      username
    };
  }

  async isUserConfirmed(email: string) {
    const validEmail = Email(email);
    const user = await this.repo.getByEmail(validEmail);
    if (!user) throw NotFoundException("User does not exist.");
    return null === user.confirmation_code;
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
    if (!currentHash) throw UnauthorizedException("Incorrect email or password.");

    const correctPassword = await bcrypt.compare(password, currentHash);
    if (!correctPassword) throw UnauthorizedException("Incorrect email or password.");
  }

  async doesUserExist(email: string) {
    const validEmail = Email(email);
    const user = await this.repo.getByEmail(validEmail);
    if (!user) throw UnauthorizedException("Incorrect email or password.");
    return user;
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
}

type ResendConfirmationCodeParams = {
  email:    string;
  password: string;
};

type LoginParams = {
  email:    string;
  password: string;
};

type IsCorrectPasswordParams = {
  email:    string;
  password: string;
};

type SendConfirmationCodeParams = {
  email:             string;
  confirmation_code: string;
};
