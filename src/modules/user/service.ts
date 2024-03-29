import { ConflictException, NotFoundException, ForbiddenException } from '../../utils/exceptions';
import { ImageRepo } from '../image/repo';
import { RecipeRepo } from '../recipe/repo';
import { EquipmentRepo } from '../equipment/repo';
import { IngredientRepo } from '../ingredient/repo';
import { NOBSC_USER_ID, UNKNOWN_USER_ID } from '../shared/model';
import { User } from './model';
import { UserRepoInterface } from './repo';
import { UserAuthenticationService } from './authentication/service';

export class UserService {
  private readonly repo: UserRepoInterface;

  constructor(repo: UserRepoInterface) {
    this.repo = repo;
  }

  async create(params: CreateParams) {
    const userAuthenticationService = new UserAuthenticationService(this.repo);
    const encryptedPassword = await userAuthenticationService.hashPassword(params.password);

    const user = User.create({
      email:    params.email,
      password: encryptedPassword,
      username: params.username
    }).getDTO();

    const emailExists = await this.repo.getByEmail(user.email);
    if (emailExists) throw new ConflictException('Email already in use.');

    const usernameExists = await this.repo.getByUsername(user.username);
    if (usernameExists) throw new ConflictException('Username already in use.');
  
    await this.repo.insert({
      user_id:           user.user_id,
      email:             user.email,
      password:          user.password,
      username:          user.username,
      confirmation_code: user.confirmation_code!
    });
    
    await userAuthenticationService.sendConfirmationCode({
      email:             user.email,
      confirmation_code: user.confirmation_code!
    });
  }

  // TO DO: first send confirmation code to their new_email
  async updateEmail({ user_id, new_email, password }: UpdateEmailParams) {
    const existingUser = await this.repo.getByUserId(user_id);
    if (!existingUser) throw new NotFoundException('User does not exist.');

    const emailExists = await this.repo.getByEmail(new_email);
    if (emailExists) throw new ConflictException('Email already in use.');

    const userAuthenticationService = new UserAuthenticationService(this.repo);
    await userAuthenticationService.isCorrectPassword({
      email: existingUser.email,
      password
    });
    
    const user = User.update({
      user_id,
      email:             new_email,  // the update
      password:          password!,
      username:          existingUser.username,
      confirmation_code: existingUser.confirmation_code
    }).getDTO();

    await this.repo.update(user);
  }

  async updatePassword({ user_id, new_password, current_password }: UpdatePasswordParams) {
    const existingUser = await this.repo.getByUserId(user_id);
    if (!existingUser) throw new NotFoundException('User does not exist.');

    const userAuthenticationService = new UserAuthenticationService(this.repo);

    await userAuthenticationService.isCorrectPassword({
      email: existingUser.email,
      password: current_password
    });

    const encryptedPassword = await userAuthenticationService.hashPassword(new_password);
    
    const user = User.update({
      user_id,
      email:             existingUser.email,
      password:          encryptedPassword,  // the update
      username:          existingUser.username,
      confirmation_code: existingUser.confirmation_code
    }).getDTO();

    await this.repo.update(user);
  }

  async resetPassword({ user_id, new_password }: ResetPasswordParams) {
    const existingUser = await this.repo.getByUserId(user_id);
    if (!existingUser) throw new NotFoundException('User does not exist.');

    const userAuthenticationService = new UserAuthenticationService(this.repo);

    const encryptedPassword = await userAuthenticationService.hashPassword(new_password);
    
    const user = User.update({
      user_id,
      email:             existingUser.email,
      password:          encryptedPassword,  // the update
      username:          existingUser.username,
      confirmation_code: existingUser.confirmation_code
    }).getDTO();

    await this.repo.update(user);
  }

  async updateUsername({ user_id, new_username }: UpdateUsernameParams) {
    const existingUser = await this.repo.getByUserId(user_id);
    if (!existingUser) throw new NotFoundException('User does not exist.');

    const usernameExists = await this.repo.getByUsername(new_username);
    if (usernameExists) throw new ConflictException('Username already in use.');

    const password = await this.repo.getPassword(existingUser.email);
    
    const user = User.update({
      user_id,
      email:             existingUser.email,
      password:          password!,
      username:          new_username,  // the update
      confirmation_code: existingUser.confirmation_code
    }).getDTO();

    await this.repo.update(user);
  }

  async delete({ user_id, password }: DeleteParams) {
    // IMPORTANT: Never allow this user to be deleted.
    if (user_id === NOBSC_USER_ID) throw new ForbiddenException();
    // IMPORTANT: Never allow this user to be deleted.
    if (user_id === UNKNOWN_USER_ID) throw new ForbiddenException();

    // get current user by user_id
    //if (password !== existingUser.password)

    //const planRepo = new PlanRepo();
    //await planRepo.unattributeAll(user_id);  // currently ON DELETE CASCASE in MySQL
    //await planRepo.deleteAll(user_id);  // currently ON DELETE CASCASE in MySQL

    const recipeRepo = new RecipeRepo();
    await recipeRepo.unattributeAll(user_id);
    await recipeRepo.deleteAll(user_id);
    // TO DO: still delete their private images from AWS S3

    const equipmentRepo = new EquipmentRepo();
    await equipmentRepo.deleteAll(user_id);
    // TO DO: still delete their private images from AWS S3

    const ingredientRepo = new IngredientRepo();
    await ingredientRepo.deleteAll(user_id);
    // TO DO: still delete their private images from AWS S3

    // TO DO: how to delete their chatgroups  // currently ON DELETE CASCASE in MySQL
    // and chatrooms and chatmessages and private messages ???
    // TO DO: still delete their private images from AWS S3

    const imageRepo = new ImageRepo();
    await imageRepo.unattributeAll(user_id);
    await imageRepo.deleteAll(user_id);

    await this.repo.delete(user_id);
  }
}

type CreateParams = {
  email:    string;
  password: string;
  username: string;
};

type UpdateEmailParams = {
  user_id:   string;
  new_email: string;
  password:  string;
};

type UpdatePasswordParams = {
  user_id:          string;
  new_password:     string;
  current_password: string;
};

type ResetPasswordParams = {
  user_id:      string;
  new_password: string;
};

type UpdateUsernameParams = {
  user_id:      string;
  new_username: string;
};

type DeleteParams = {
  user_id:  string;
  password: string;
};
