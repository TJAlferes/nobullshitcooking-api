import { PublicRecipeService } from "./service";
import type {
  EquipmentRepoInterface,
  IngredientRepoInterface,
  RecipeRepoInterface
} from "./service";

// TO DO: handle optional amount and unit
describe('PublicRecipeService', () => {
  const params = {
    required_equipment: [
      {amount: 1, equipment_id: "1"},
      {amount: 1, equipment_id: "2"}
    ],
    required_ingredients: [
      {amount: 1, unit_id: 1, ingredient_id: "1"},
      {amount: 2, unit_id: 2, ingredient_id: "2"}
    ],
    required_subrecipes: [
      {amount: 1, unit_id: 1, subrecipe_id: "1"}
    ]
  };
  let equipmentRepoMock: jest.Mocked<EquipmentRepoInterface>;
  let ingredientRepoMock: jest.Mocked<IngredientRepoInterface>;
  let recipeRepoMock: jest.Mocked<RecipeRepoInterface>;
  let service: PublicRecipeService;

  beforeEach(() => {
    equipmentRepoMock = {hasPrivate: jest.fn()} as jest.Mocked<EquipmentRepoInterface>;
    ingredientRepoMock = {hasPrivate: jest.fn()} as jest.Mocked<IngredientRepoInterface>;
    recipeRepoMock = {hasPrivate: jest.fn()} as jest.Mocked<RecipeRepoInterface>;
    service = new PublicRecipeService({
      equipmentRepo: equipmentRepoMock,
      ingredientRepo: ingredientRepoMock,
      recipeRepo: recipeRepoMock
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkForPrivateContent method', () => {
    it('handles when a required_equipment is private', async () => {
      equipmentRepoMock.hasPrivate.mockResolvedValue(true);
      try {
        await service.checkForPrivateContent(params);
      } catch (err: any) {
        expect(err.message).toBe('Public content may not contain private content.');
      }
    });

    it('handles when a required_ingredient is private', async () => {
      equipmentRepoMock.hasPrivate.mockResolvedValue(false);
      ingredientRepoMock.hasPrivate.mockResolvedValue(true);
      try {
        await service.checkForPrivateContent(params);
      } catch (err: any) {
        expect(err.message).toBe('Public content may not contain private content.');
      }
    });

    it('handles when a required_subrecipe is private', async () => {
      equipmentRepoMock.hasPrivate.mockResolvedValue(false);
      ingredientRepoMock.hasPrivate.mockResolvedValue(false);
      recipeRepoMock.hasPrivate.mockResolvedValue(true);
      try {
        await service.checkForPrivateContent(params);
      } catch (err: any) {
        expect(err.message).toBe('Public content may not contain private content.');
      }
    });

    it('handles success', async () => {
      equipmentRepoMock.hasPrivate.mockResolvedValue(false);
      ingredientRepoMock.hasPrivate.mockResolvedValue(false);
      recipeRepoMock.hasPrivate.mockResolvedValue(false);
      try {
        await service.checkForPrivateContent(params);
      } catch (err: any) {
        throw err;
      }
    });
  });
});
