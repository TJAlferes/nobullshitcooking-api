import bcrypt from 'bcrypt';

import { ModifiedSession } from '../../../app';
import { Email, Password } from '../model';
import { IUserRepo }       from '../repo';
//crypto.timingSafeEqual() ???

export class UserAuthenticationService {
  private readonly repo: IUserRepo;

  constructor(repo: IUserRepo) {
    this.repo = repo;
  }

  async hashPassword(password: string) {
    const validPassword = Password(password);
    const encryptedPassword = await bcrypt.hash(validPassword, 10);
    return encryptedPassword;
  }

  async isCorrectPassword(params: IsCorrectPasswordParams) {
    const email = Email(params.email);
    const password = Password(params.password);
    const user = await this.repo.getByEmail(email);
    const correctPassword = await bcrypt.compare(password, user.password);
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
    const confirmed = user.confirmation_code === null;
    if (!confirmed) {
      throw new Error("Please check your email for your confirmation code.");
    }
  }

  async login({ email, password, session }: LoginParams) {
    const user = await this.doesUserExist(email);
    await this.isUserConfirmed(email);
    await this.isCorrectPassword({email, password});

    session.userInfo = {
      id:       user.user_id,
      username: user.username
    };
  
    return user.username;
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
