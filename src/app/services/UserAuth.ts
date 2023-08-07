import bcrypt     from 'bcrypt';
import { uuidv7 } from 'uuidv7';

import { Email, Password, ConfirmationCode } from '../../domain/User';
import { IUserRepo }                         from '../../infra/repos/mysql';
import { emailUser }                         from './simple-email-service';
//crypto.timingSafeEqual() ???

// DRY the repeated validation logic

export class UserAuthService {
  repo: IUserRepo;

  constructor(repo: IUserRepo) {
    this.repo = repo;  // .bind(this) ???
  }

  async verify(params: VerifyParams) {
    const email = Email(params.email);
    const user = await this.repo.getByEmail(email);
    if (!user) {
      throw new Error("Incorrect email or password.");  // throw error message from this layer? or just return json message?
    }
  
    const confirmationCode = ConfirmationCode(params.confirmationCode);
    const correctConfirmationCode = confirmationCode === user.confirmation_code;
    if (!correctConfirmationCode) {
      throw new Error("An issue occurred, please double check your info and try again.");
    }

    const password = Password(params.password);
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new Error("Incorrect email or password.");
    }
  
    await this.repo.verify(email);
  }

  async resendConfirmationCode(params: ResendConfirmationCodeParams) {
    const email = Email(params.email);
    const user = await this.repo.getByEmail(email);
    if (!user) {
      throw new Error("Incorrect email or password.");  // throw error message from this layer? or just return json message?
    }

    const confirmed = user.confirmation_code === null;  // IMPORTANT: double check your struct is not fucking with this
    if (confirmed) {
      throw new Error("Already verified.");
    }
  
    const password = Password(params.password);
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new Error("Incorrect email or password.");
    }
  
    const confirmationCode = uuidv7();
    const charset  = "UTF-8";
    const from     = "No Bullshit Cooking <staff@nobullshitcooking.com>";
    const to       = email;
    const subject  = "Confirmation Code For No Bullshit Cooking";
    const bodyText = "Confirmation Code For No Bullshit Cooking\r\n"
      + "Please enter the following confirmation code at:\r\n"
      + "https://nobullshitcooking.com/verify\r\n"
      + confirmationCode;
    const bodyHtml = `
      <html>
      <head></head>
      <body>
        <h1>Confirmation Code For No Bullshit Cooking</h1>
        <p>Please enter the following confirmation code at:</p>
        <p>https://nobullshitcooking.com/verify</p>
        ${confirmationCode}
      </body>
      </html>
    `;

    emailUser({from, to, subject, bodyText, bodyHtml, charset});
  }

  async login(params: LoginParams) {
    const email = Email(params.email);
    const user = await this.repo.getByEmail(email);
    if (!user) {
      throw new Error("Incorrect email or password.");
    }
  
    const confirmed = user.confirmation_code === null;
    if (!confirmed) {
      throw new Error("Please check your email for your confirmation code.");
    }

    const password = Password(params.password);
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new Error("Incorrect email or password.");
    }
  
    return {
      id:       user.id,
      username: user.username
    };
  }

  // logout is handled in the controller???
}

type VerifyParams = {
  email:            string;
  password:         string;
  confirmationCode: string;       
};

type ResendConfirmationCodeParams = {
  email:    string;
  password: string;
};

type LoginParams = {
  email:    string;
  password: string;
};
