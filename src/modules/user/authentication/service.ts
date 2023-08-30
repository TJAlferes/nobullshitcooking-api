import bcrypt from 'bcrypt';

import { ModifiedSession }   from '../../../app';
import { Email, Password }   from '../model';
import { UserRepoInterface } from '../repo';
//crypto.timingSafeEqual() ???

export class UserAuthenticationService {
  private readonly repo: UserRepoInterface;

  constructor(repo: UserRepoInterface) {
    this.repo = repo;
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

  async isUserConfirmed(email: string) {
    const validEmail = Email(email);
    const user = await this.repo.getByEmail(validEmail);
    return user.confirmation_code === null;
  }

  async login({ email, password, session }: LoginParams) {
    const { user_id, username } = await this.doesUserExist(email);

    const confirmed = await this.isUserConfirmed(email);
    if (!confirmed) {
      throw new Error("Please check your email for your confirmation code.");
    }

    await this.isCorrectPassword({email, password});

    session.userInfo = {
      user_id,
      username
    };
  
    return username;
  }
}

type LoginParams = {
  email:    string;
  password: string;
  session:  ModifiedSession;
};

type IsCorrectPasswordParams = {
  email:    string;
  password: string;
};
