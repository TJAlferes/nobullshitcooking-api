import bcrypt     from 'bcrypt';
import { uuidv7 } from 'uuidv7';

import { Email, Password, ConfirmationCode, User } from '../model';
import { UserRepoInterface }                 from '../repo';
import { emailUser }                         from '../shared/simple-email-service';
//crypto.timingSafeEqual() ???

// DRY the repeated validation logic

export class UserConfirmationService {
  private readonly repo: UserRepoInterface;

  constructor(repo: UserRepoInterface) {
    this.repo = repo;
  }

  async confirm(confirmation_code: string) {
    const code = ConfirmationCode(confirmation_code);
    if (!code) {
      throw new Error("An issue occurred, please double check your info and try again.");
    }

    const user = await this.repo.getByConfirmationCode(code);

    if (null === user.confirmation_code) {
      throw new Error("Already confirmed.");
    }

    if (code !== user.confirmation_code) {
      throw new Error("An issue occurred, please double check your info and try again.");
    }

    const password = await this.repo.getPassword(user.email);
    await this.repo.update({
      user_id:           user.user_id,
      email:             user.email,
      password,
      username:          user.username,
      confirmation_code: null
    });
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

  async resendConfirmationCode(params: ResendConfirmationCodeParams) {
    const email = Email(params.email);
    const user = await this.repo.getByEmail(email);
    if (!user) {
      throw new Error("Incorrect email or password.");  // throw error message from this layer? or just return json message?
    }

    const confirmed = user.confirmation_code === null;  // IMPORTANT: double check your struct is not fucking with this
    if (confirmed) {
      throw new Error("Already confirmed.");
    }
  
    // MOVE TO UserAuthenticationService
    const password = Password(params.password);
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new Error("Incorrect email or password.");
    }
  
    const confirmationCode = uuidv7();  // NO!!! get it from the userRepo!!!

    await this.sendConfirmationCode(user);
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
