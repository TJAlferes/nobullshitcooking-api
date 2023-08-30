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
  
    await this.repo.insert(user);

    const { sendConfirmationCode } = new UserConfirmationService(this.repo);
    await sendConfirmationCode(user);
  }

  async updateEmail(old_email, new_email) {
    const { email, password, username } = params;

    const existingUser = await this.repo.getByUsername(params.username);
    if (!existingUser) return;
    //
    const user = User.update(params).getDTO();
    await this.repo.update(user);
  }

  async updatePassword(old_password, new_password) {

  }

  async updateUsername(old_username, new_username) {

  }

  async recoverAccount

  /*async delete(userId: string) {
    if (userId === 1) return;  // IMPORTANT: Never allow user 1, NOBSC, to be deleted.

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
  }*/
}

type CreateParams = {
  email:    string;
  password: string;
  username: string;
};

type UpdateParams = CreateParams & {
  user_id: string;
};
