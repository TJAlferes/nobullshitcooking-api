import { NOBSC_USER_ID, UNKNOWN_USER_ID } from '../shared/model';
import { User }                      from './model';
import { UserRepoInterface }         from './repo';
import { UserAuthenticationService } from './authentication/service';
import { UserConfirmationService }   from './confirmation/service';

export class UserService {
  private readonly repo: UserRepoInterface;

  constructor(repo: UserRepoInterface) {
    this.repo = repo;
  }

  async create(params: CreateParams) {
    const { hashPassword } = new UserAuthenticationService(this.repo);
    const encryptedPassword = await hashPassword(params.password);

    const user = User.create({
      email:    params.email,
      password: encryptedPassword,
      username: params.username
    }).getDTO();

    // should this also be done inside the value object constructor? (using a repo interface)
    const emailExists = await this.repo.getByEmail(user.email);
    if (emailExists) {
      throw new Error("Email already in use.");  // throw in this layer? or return json?
    }

    const usernameExists = await this.repo.getByUsername(user.username);
    if (usernameExists) {
      throw new Error("Username already in use.");
    }
  
    await this.repo.insert({
      user_id:           user.user_id,
      email:             user.email,
      password:          user.password,
      username:          user.username,
      confirmation_code: user.confirmation_code!
    });

    const { sendConfirmationCode } = new UserConfirmationService(this.repo);
    await sendConfirmationCode({
      email:             user.email,
      confirmation_code: user.confirmation_code!
    });
  }

  async updateEmail({ user_id, new_email }: UpdateEmailParams) {
    const existingUser = await this.repo.getByUserId(user_id);
    if (!existingUser) return;

    const password = await this.repo.getPassword(existingUser.email);
    
    const user = User.update({
      user_id,
      email:             new_email,  // the update
      password,
      username:          existingUser.username,
      confirmation_code: existingUser.confirmation_code
    }).getDTO();

    await this.repo.update(user);
  }

  async updatePassword({ user_id, new_password }: UpdatePasswordParams) {
    const existingUser = await this.repo.getByUserId(user_id);
    if (!existingUser) return;

    const { hashPassword } = new UserAuthenticationService(this.repo);
    const encryptedPassword = await hashPassword(new_password);
    
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
    if (!existingUser) return;

    const password = await this.repo.getPassword(existingUser.email);
    
    const user = User.update({
      user_id,
      email:             existingUser.email,
      password,
      username:          new_username,  // the update
      confirmation_code: existingUser.confirmation_code
    }).getDTO();

    await this.repo.update(user);
  }

  //async recoverAccount() {}

  async delete(user_id: string) {
    if (user_id === NOBSC_USER_ID) return;    // IMPORTANT: Never allow this user to be deleted.
    if (user_id === UNKNOWN_USER_ID) return;  // IMPORTANT: Never allow this user to be deleted.

    // NOTE: Due to MySQL foreign keys, deletes must be in this order.
    // TO DO: Let MySQL ON DELETE CASCADE handle most of this.

    // First delete/disown the user's relationships and content...
    await Promise.all([
      friendshipRepo.deleteAllByUserId(userId),      // ok
      planRepo.deleteAll(userId),                    // NOT OK???
      favoriteRecipeRepo.deleteAllByUserId(userId),  // ok
      savedRecipeRepo.deleteAllByUserId(userId)      // ok
    ]);

    await recipeRepo.disownAllByAuthorId(userId);  // ???

    const recipeIds = await recipeRepo.getPrivateIds(userId);  // CAREFUL! Double check this.
    await Promise.all([
      recipeEquipmentRepo.deleteByRecipeIds(recipeIds),
      recipeIngredientRepo.deleteByRecipeIds(recipeIds),
      recipeMethodRepo.deleteByRecipeIds(recipeIds),
      recipeSubrecipeRepo.deleteByRecipeIds(recipeIds),
      recipeSubrecipeRepo.deleteBySubrecipeIds(recipeIds)
    ]);
    await recipeRepo.deleteAllByOwnerId(userId);  // CAREFUL! Double check this.

    await Promise.all([equipmentRepo.deleteAll(userId), ingredientRepo.deleteAll(userId)]);  // ok

    // ... Then delete the user.
    await this.repo.delete(userId);
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
};

type UpdatePasswordParams = {
  user_id:      string;
  new_password: string;
};

type UpdateUsernameParams = {
  user_id:      string;
  new_username: string;
};
