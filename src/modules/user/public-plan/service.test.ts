import { PublicPlanService, RecipeRepoInterface } from "./service.js";

describe('PublicRecipeService', () => {
  const included_recipes = [
    {recipe_id: "1", day_number: 1, recipe_number: 1}
  ];
  let recipeRepoMock: jest.Mocked<RecipeRepoInterface>;
  let service: PublicPlanService;

  beforeEach(() => {
    recipeRepoMock = {hasPrivate: jest.fn()} as jest.Mocked<RecipeRepoInterface>;
    service = new PublicPlanService(recipeRepoMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkForPrivateContent method', () => {
    it('handles when an included_recipe is private', async () => {
      recipeRepoMock.hasPrivate.mockResolvedValue(true);
      try {
        await service.checkForPrivateContent(included_recipes);
      } catch (err: any) {
        expect(err.message).toBe('Public content may not contain private content.');
      }
    });

    it('handles success', async () => {
      recipeRepoMock.hasPrivate.mockResolvedValue(false);
      try {
        await service.checkForPrivateContent(included_recipes);
      } catch (err: any) {
        throw err;
      }
    });
  });
});
