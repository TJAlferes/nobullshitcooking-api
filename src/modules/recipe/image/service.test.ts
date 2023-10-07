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
      bulkUpdate: jest.fn()
    };
    recipeImageRepoMock = {

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
