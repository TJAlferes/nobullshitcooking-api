import { Request, Response } from 'express';
import { Client } from '@elastic/elasticsearch';

import { SearchController } from '../../../src/controllers';

const esClient: Partial<Client> = {};
const controller = new SearchController(<Client>esClient);

const found = {some: "value"};
jest.mock('../../../src/access/elasticsearch', () => ({
  EquipmentSearch: jest.fn().mockImplementation(() => ({
    auto: autoEquipment,
    find: findEquipment
  })),
  IngredientSearch: jest.fn().mockImplementation(() => ({
    auto: autoIngredients,
    find: findIngredients
  })),
  ProductSearch: jest.fn().mockImplementation(() => ({
    auto: autoProducts,
    find: findProducts
  })),
  RecipeSearch: jest.fn().mockImplementation(() => ({
    auto: autoRecipes,
    find: findRecipes
  }))
}));
let autoEquipment = jest.fn().mockResolvedValue(found);
let findEquipment = jest.fn().mockResolvedValue(found);
let autoIngredients = jest.fn().mockResolvedValue(found);
let findIngredients = jest.fn().mockResolvedValue(found);
let autoProducts = jest.fn().mockResolvedValue(found);
let findProducts = jest.fn().mockResolvedValue(found);
let autoRecipes = jest.fn().mockResolvedValue(found);
let findRecipes = jest.fn().mockResolvedValue(found);

afterEach(() => {
  jest.clearAllMocks();
});

describe('search controller', () => {
  //describe('autoAll method', () => {});

  //describe('findAll method', () => {});

  describe('autoEquipment method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses auto', async () => {
      await controller.autoEquipment(<Request>req, <Response>res);
      expect(autoEquipment).toHaveBeenCalledWith("term");
    });

    it('returns sent data', async () => {
      const actual =
        await controller.autoEquipment(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
      expect(actual).toEqual({found});
    });
  });

  describe('findEquipment method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses find', async () => {
      await controller.findEquipment(<Request>req, <Response>res);
      expect(findEquipment).toHaveBeenCalledWith({someBody: "value"});
    });

    it('returns sent data', async () => {
      const actual =
        await controller.findEquipment(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
      expect(actual).toEqual({found});
    });
  });

  describe('autoIngredients method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses auto', async () => {
      await controller.autoIngredients(<Request>req, <Response>res);
      expect(autoIngredients).toHaveBeenCalledWith("term");
    });

    it('returns sent data', async () => {
      const actual =
        await controller.autoIngredients(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
      expect(actual).toEqual({found});
    });
  });

  describe('findIngredients method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses find', async () => {
      await controller.findIngredients(<Request>req, <Response>res);
      expect(findIngredients).toHaveBeenCalledWith({someBody: "value"});
    });

    it('returns sent data', async () => {
      const actual =
        await controller.findIngredients(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
      expect(actual).toEqual({found});
    });
  });

  describe('autoProducts method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses auto', async () => {
      await controller.autoProducts(<Request>req, <Response>res);
      expect(autoProducts).toHaveBeenCalledWith("term");
    });

    it('returns sent data', async () => {
      const actual = await controller.autoProducts(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
      expect(actual).toEqual({found});
    });
  });

  describe('findProducts method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses find', async () => {
      await controller.findProducts(<Request>req, <Response>res);
      expect(findProducts).toHaveBeenCalledWith({someBody: "value"});
    });

    it('returns sent data', async () => {
      const actual = await controller.findProducts(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
      expect(actual).toEqual({found});
    });
  });

  describe('autoRecipes method', () => {
    const req: Partial<Request> = {body: {searchTerm: "term"}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses auto', async () => {
      await controller.autoRecipes(<Request>req, <Response>res);
      expect(autoRecipes).toHaveBeenCalledWith("term");
    });

    it('returns sent data', async () => {
      const actual = await controller.autoRecipes(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
      expect(actual).toEqual({found});
    });
  });

  describe('findRecipes method', () => {
    const req: Partial<Request> = {body: {body: {someBody: "value"}}};
    const res: Partial<Response> = {json: jest.fn().mockResolvedValue({found})};

    it('uses find', async () => {
      await controller.findRecipes(<Request>req, <Response>res);
      expect(findRecipes).toHaveBeenCalledWith({someBody: "value"});
    });

    it('returns sent data', async () => {
      const actual = await controller.findRecipes(<Request>req, <Response>res);
      expect(res.json).toHaveBeenCalledWith({found});
      expect(actual).toEqual({found});
    });
  });
});