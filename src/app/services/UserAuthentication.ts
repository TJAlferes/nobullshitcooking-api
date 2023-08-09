import bcrypt from 'bcrypt';

import { Email, Password } from '../../domain/User';
import { IUserRepo }       from '../../infra/repos/mysql';
//crypto.timingSafeEqual() ???

// DRY the repeated validation logic

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

  async comparePassword(password: string, currentHash: string) {  // no, this should get it from repo itself
    const validPassword = Password(password);
    const currentHash = await this.repo.getPasswor
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new Error("Incorrect email or password.");
    }
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

    this.comparePassword(params.password);
    const password = Password(params.password);
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new Error("Incorrect email or password.");
    }

    params.session.userInfo = {
      id:       user.id,
      username: user.username
    };
  
    return user.username;
  }

  // logout is handled in the controller???
}

type LoginParams = {
  email:    string;
  password: string;
  session: 
};

type ComparePasswordParams = {
  password: string;
  hash:     string;
};
