import { User }      from '../../domain/User';
import { IUserRepo } from '../../infra/repos/mysql';
import {
  UserAuthenticationService,
  UserConfirmationService
} from '.';

export class UserService {
  private readonly repo: IUserRepo;

  constructor(repo: IUserRepo) {
    this.repo = repo;
  }

  async create(params: CreateParams) {

    const userAuthenticationService = new UserAuthenticationService(this.repo);
    const encryptedPassword =
      await userAuthenticationService.hashPassword(params.password);

    const user = User.create({
      email:    params.email,
      password: encryptedPassword,
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

  async update(params: UpdateParams) {
    const { id, email, password, username, confirmation_code } = params;

    if (id === 1) {  // IMPORTANT: Do not allow user 1, NOBSC, to be changed.
      throw new Error("Unauthorized.");
    }
    // await this.repo.getById(id);  // necessary???

    //const encryptedPass = await bcrypt.hash(password, 10);  // ???
    const user = User.update(params);

    await this.repo.update(user);
  }

  async delete(userId: string) {
    if (userId === 1) return;  // IMPORTANT: Never allow user 1, NOBSC, to be deleted.

    // (Do this in MySQL instead if possible) (cascading deletes)
    /*const equipmentRepo =        new EquipmentRepo();
    const favoriteRecipeRepo =   new FavoriteRecipeRepo();
    const friendshipRepo =       new FriendshipRepo();
    const ingredientRepo =       new IngredientRepo();
    const planRepo =             new PlanRepo();
    const recipeRepo =           new RecipeRepo();
    const recipeEquipmentRepo =  new RecipeEquipmentRepo();
    const recipeIngredientRepo = new RecipeIngredientRepo();
    const recipeMethodRepo =     new RecipeMethodRepo();
    const recipeSubrecipeRepo =  new RecipeSubrecipeRepo();
    const savedRecipeRepo =      new SavedRecipeRepo();
    const userRepo =             new UserRepo();

    // NOTE: Due to foreign key constraints, deletes must be in this order. (Do this in MySQL instead?) (WHAT!?)

    // First delete/disown the user's relationships and content...
    await Promise.all([
      friendshipRepo.deleteAllByUserId(userId),
      planRepo.deleteAll(userId),
      favoriteRecipeRepo.deleteAllByUserId(userId),
      savedRecipeRepo.deleteAllByUserId(userId)
    ]);
    await recipeRepo.disownAllByAuthorId(userId);
    const recipeIds = await recipeRepo.getPrivateIds(userId);  // CAREFUL! Double check this.
    await Promise.all([
      recipeEquipmentRepo.deleteByRecipeIds(recipeIds),
      recipeIngredientRepo.deleteByRecipeIds(recipeIds),
      recipeMethodRepo.deleteByRecipeIds(recipeIds),
      recipeSubrecipeRepo.deleteByRecipeIds(recipeIds),
      recipeSubrecipeRepo.deleteBySubrecipeIds(recipeIds)
    ]);
    await recipeRepo.deleteAllByOwnerId(userId);  // CAREFUL! Double check this.
    await Promise.all([equipmentRepo.deleteAll(userId), ingredientRepo.deleteAll(userId)]);*/

    // ... Then delete the user.
    await userRepo.deleteById(userId);
  }
}

type CreateParams = {
  email:    string;
  password: string;
  username: string;
};

type UpdateParams = CreateParams & {
  id: string;
};
