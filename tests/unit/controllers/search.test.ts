import { Request, Response } from 'express';
import { Client } from '@elastic/elasticsearch';

import { SearchController } from '../../../src/controllers/search';

const esClient: Partial<Client> = {};
const controller = new SearchController(<Client>esClient);

const found = {some: "value"};

jest.mock('../../../src/elasticsearch-access/EquipmentSearch', () => ({
  EquipmentSearch: jest.fn().mockImplementation(() => ({
    auto: mockAutoEquipment,
    find: mockFindEquipment
  }))
}));
let mockAutoEquipment = jest.fn().mockResolvedValue(found);
let mockFindEquipment = jest.fn().mockResolvedValue(found);

jest.mock('../../../src/elasticsearch-access/IngredientSearch', () => ({
  IngredientSearch: jest.fn().mockImplementation(() => ({
    auto: mockAutoIngredients,
    find: mockFindIngredients
  }))
}));
let mockAutoIngredients = jest.fn().mockResolvedValue(found);
let mockFindIngredients = jest.fn().mockResolvedValue(found);

jest.mock('../../../src/elasticsearch-access/ProductSearch', () => ({
  ProductSearch: jest.fn().mockImplementation(() => ({
    auto: mockAutoProducts,
    find: mockFindProducts
  }))
}));
let mockAutoProducts = jest.fn().mockResolvedValue(found);
let mockFindProducts = jest.fn().mockResolvedValue(found);

jest.mock('../../../src/elasticsearch-access/RecipeSearch', () => ({
  RecipeSearch: jest.fn().mockImplementation(() => ({
    auto: mockAutoRecipes,
    find: mockFindRecipes
  }))
}));
let mockAutoRecipes = jest.fn().mockResolvedValue(found);
let mockFindRecipes = jest.fn().mockResolvedValue(found);

afterEach(() => {
  jest.clearAllMocks();
});

describe('search controller', () => {
  //describe('autocompletePublicAll method', () => {});

  //describe('findPublicAll method', () => {});

  describe('autocompletePublicEquipment method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses auto correctly', async () => {
      await controller.autocompletePublicEquipment(<Request>req, <Response>res);
      expect(mockAutoEquipment).toHaveBeenCalledWith("term");
    });

    it('sends data correctly', async () => {
      await controller.autocompletePublicEquipment(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await controller
        .autocompletePublicEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('findPublicEquipment method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses find correctly', async () => {
      await controller.findPublicEquipment(<Request>req, <Response>res);
      expect(mockFindEquipment).toHaveBeenCalledWith({someBody: "value"});
    });

    it('sends data correctly', async () => {
      await controller.findPublicEquipment(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual =
        await controller.findPublicEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('autocompletePublicIngredients method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses auto correctly', async () => {
      await controller
        .autocompletePublicIngredients(<Request>req, <Response>res);
      expect(mockAutoIngredients).toHaveBeenCalledWith("term");
    });

    it('sends data correctly', async () => {
      await controller
        .autocompletePublicIngredients(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await controller
        .autocompletePublicIngredients(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('findPublicIngredients method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses find correctly', async () => {
      await controller.findPublicIngredients(<Request>req, <Response>res);
      expect(mockFindIngredients).toHaveBeenCalledWith({someBody: "value"});
    });

    it('sends data correctly', async () => {
      await controller.findPublicIngredients(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await controller
        .findPublicIngredients(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('autocompletePublicProducts method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses auto correctly', async () => {
      await controller.autocompletePublicProducts(<Request>req, <Response>res);
      expect(mockAutoProducts).toHaveBeenCalledWith("term");
    });

    it('sends data correctly', async () => {
      await controller.autocompletePublicProducts(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await controller
        .autocompletePublicProducts(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('findPublicProducts method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses find correctly', async () => {
      await controller.findPublicProducts(<Request>req, <Response>res);
      expect(mockFindProducts).toHaveBeenCalledWith({someBody: "value"});
    });

    it('sends data correctly', async () => {
      await controller.findPublicProducts(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await controller
        .findPublicProducts(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('autocompletePublicRecipes method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses auto correctly', async () => {
      await controller.autocompletePublicRecipes(<Request>req, <Response>res);
      expect(mockAutoRecipes).toHaveBeenCalledWith("term");
    });

    it('sends data correctly', async () => {
      await controller.autocompletePublicRecipes(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual = await controller
        .autocompletePublicRecipes(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });

  describe('findPublicRecipes method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses find correctly', async () => {
      await controller.findPublicRecipes(<Request>req, <Response>res);
      expect(mockFindRecipes).toHaveBeenCalledWith({someBody: "value"});
    });

    it('sends data correctly', async () => {
      await controller.findPublicRecipes(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
    });

    it('returns correctly', async () => {
      const actual =
        await controller.findPublicRecipes(<Request>req, <Response>res);
      expect(actual).toEqual({found});
    });
  });
});