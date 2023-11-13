import type { Request, Response } from 'express';
import type { Session, SessionData } from 'express-session';

import { publicRecipeController as controller } from './controller';
import { EquipmentRepo } from '../../equipment/repo';
import { IngredientRepo } from '../../ingredient/repo';
import { ImageRepo } from '../../image/repo';
import { RecipeImageRepo } from '../../recipe/image/repo';
import { RecipeEquipmentRepo } from '../../recipe/required-equipment/repo';
import { RecipeIngredientRepo } from '../../recipe/required-ingredient/repo';
import { RecipeMethodRepo } from '../../recipe/required-method/repo';
import { RecipeSubrecipeRepo } from '../../recipe/required-subrecipe/repo';
import { RecipeRepo } from '../../recipe/repo';
//import type { ModifiedSession } from '../../../app';

jest.mock('../../equipment/repo');
jest.mock('../../ingredient/repo');
jest.mock('../../image/repo');
jest.mock('../../recipe/image/repo');
jest.mock('../../recipe/required-equipment/repo');
jest.mock('../../recipe/required-ingredient/repo');
jest.mock('../../recipe/required-method/repo');
jest.mock('../../recipe/required-subrecipe/repo');
jest.mock('../../recipe/repo');

const equipmentRepoMock = EquipmentRepo as unknown as jest.Mocked<EquipmentRepo>;
const ingredientRepoMock = IngredientRepo as unknown as jest.Mocked<IngredientRepo>;
const imageRepoMock = ImageRepo as unknown as jest.Mocked<ImageRepo>;
const recipeImageRepoMock = RecipeImageRepo as unknown as jest.Mocked<RecipeImageRepo>;
const recipeEquipmentRepoMock = RecipeEquipmentRepo as unknown as jest.Mocked<RecipeEquipmentRepo>;
const recipeIngredientRepoMock = RecipeIngredientRepo as unknown as jest.Mocked<RecipeIngredientRepo>;
const recipeMethodRepoMock = RecipeMethodRepo as unknown as jest.Mocked<RecipeMethodRepo>;
const recipeSubrecipeRepoMock = RecipeSubrecipeRepo as unknown as jest.Mocked<RecipeSubrecipeRepo>;
const recipeRepoMock = RecipeRepo as unknown as jest.Mocked<RecipeRepo>;

interface MockRequest extends Request {
  //session: ModifiedSession;
  session: Session & Partial<SessionData>;
}

// TO DO: FINISH

describe('publicRecipeController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        
      },
      session: {
        user_id: '1'
      }
    } as MockRequest;
    res = {
      status: jest.fn(),
      json: jest.fn()
    };
    equipmentRepoMock.hasPrivate.mockResolvedValue(false);
    ingredientRepoMock.hasPrivate.mockResolvedValue(false);
    recipeRepoMock.hasPrivate.mockResolvedValue(false);
    recipeRepoMock.insert = jest.fn();

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
    it('handles when upload has private equipment', async () => {
      equipmentRepoMock.hasPrivate.mockResolvedValue(true);
      try {
        await controller.create(<Request>req, <Response>res);
      } catch (err: any) {
        expect(err.message).toBe('Public content may not contain private content.');
      }
      expect(recipeRepoMock.insert).not.toHaveBeenCalled();
    });

    it('handles when upload has private ingredient', async () => {
      ingredientRepoMock.hasPrivate.mockResolvedValue(true);
      try {
        await controller.create(<Request>req, <Response>res);
      } catch (err: any) {
        expect(err.message).toBe('Public content may not contain private content.');
      }
      expect(recipeRepoMock.insert).not.toHaveBeenCalled();
    });

    it('handles when upload has private subrecipe', async () => {
      recipeRepoMock.hasPrivate.mockResolvedValue(true);
      try {
        await controller.create(<Request>req, <Response>res);
      } catch (err: any) {
        expect(err.message).toBe('Public content may not contain private content.');
      }
      expect(recipeRepoMock.insert).not.toHaveBeenCalled();
    });

    it('handles', async () => {});

    it('handles success', async () => {


      await controller.create(<Request>req, <Response>res);
  
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('update method', () => {
    it('handles', async () => {});
    it('handles', async () => {});
    it('handles success', async () => {

    });
  });
});
