import bcrypt           from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { constructEmail, constructPassword, constructUsername, constructUser } from '../../models/User';  // just use these INSIDE the UserEntity
import { emailConfirmationCode } from './email-confirmation-code';
import { IUserRepo, UserRepo } from '../../access/mysql';

class UserService {
  repo: IUserRepo;  // change this (what if you want to, say, switch from MySQL to PostgreSQL)

  constructor(repo: IUserRepo) {
    this.repo = repo;
  }

  async create(params: CreateUserServiceParams) {
    const email = constructEmail(params.email);
    // should this also be done inside the value object constructor? (using a repo interface)
    const emailExists = await params.userRepo.getByEmail(email);
    if (emailExists) {
      throw new Error("Email already in use.");
    }
  
    const username = constructUsername(params.username);
    // should this also be done inside the value object constructor? (using a repo interface)
    const nameExists = await params.userRepo.getByName(username);
    if (nameExists) {
      throw new Error("Username already in use.");
    }
  
    const password = constructPassword(params.password);
    const encryptedPassword = await bcrypt.hash(password, 10);
    const confirmationCode = uuidv4();
    const user = constructUser({
      email,
      password: encryptedPassword,
      username,
      confirmationCode
    });
    
    await params.userRepo.create(user);
  
    // emailService ?
    emailConfirmationCode(email, confirmationCode);
  }
}

type CreateUserServiceParams = {
  email:    string;
  password: string;
  username: string;
  //userRepo: ;
};
