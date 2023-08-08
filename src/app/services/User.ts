import bcrypt from 'bcrypt';

import { User }                    from '../../domain/User';
import { IUserRepo }               from '../../infra/repos/mysql';
import { UserConfirmationService } from './UserConfirmation';

export class UserService {
  private readonly repo: IUserRepo;

  constructor(repo: IUserRepo) {
    this.repo = repo;
  }

  async create(params: CreateParams) {
    const password = await bcrypt.hash(params.password, 10);  // FIX THIS??? User.create's Password needs the unencrypted version???

    const user = User.create({
      email: params.email,
      password,
      username: params.username
    });

    // should this also be done inside the value object constructor? (using a repo interface)
    const emailExists = await this.repo.getByEmail(user.getEmail());
    if (emailExists) {
      throw new Error("Email already in use.");  // throw in this layer? or return json?
    }

    const nameExists = await this.repo.getByName(user.getUsername());
    if (nameExists) {
      throw new Error("Username already in use.");
    }
  
    await this.repo.create(user);

    const userConfirmationService = new UserConfirmationService(this.repo);

    userConfirmationService.sendConfirmationCode(user);
  }

  //async update() {}

  //async delete() {}
}

type CreateParams = {
  email:    string;
  password: string;
  username: string;
};
