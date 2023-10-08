import { ImageRepoInterface } from "../../image/repo";
import { RecipeImageRepoInterface } from "./repo";
import { RecipeImageService } from "./service";

jest.mock('../../image/repo');
jest.mock('./repo');

describe("RecipeImageService", () => {
  let imageRepoMock: jest.Mocked<ImageRepoInterface>;
  let recipeImageRepoMock: jest.Mocked<RecipeImageRepoInterface>;
  let service: RecipeImageService;

  beforeEach(() => {
    imageRepoMock = {
      bulkInsert: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      unattributeAll: jest.fn(),
      unattributeOne: jest.fn(),
      deleteAll: jest.fn(),
      deleteOne: jest.fn()
    };
    recipeImageRepoMock = {
      viewByRecipeId: jest.fn(),
      bulkInsert: jest.fn(),
      bulkUpdate: jest.fn(),
      deleteByImageId: jest.fn(),
      deleteByRecipeId: jest.fn()
    };
    service = new RecipeImageService({
      imageRepo: imageRepoMock,
      recipeImageRepo: recipeImageRepoMock
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("bulkCreate method", () => {
    it("handles ", async () => {

    });

    it("handles success", async () => {
      
    });
  });

  describe("bulkUpdate method", () => {
    it("handles ", async () => {
      
    });

    it("handles success", async () => {
      
    });
  });
});
