import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { userEquipmentController } from './equipment';

jest.mock('superstruct');

jest.mock('../../mysql-access/Equipment', () => {
  const originalModule = jest.requireActual('../../mysql-access/Equipment');
  return {
    ...originalModule,
    Equipment: jest.fn().mockImplementation(() => ({
      viewEquipment: mockViewEquipment,
      viewEquipmentById: mockViewEquipmentById,
      createMyPrivateUserEquipment: mockCreateMyPrivateUserEquipment,
      updateMyPrivateUserEquipment: mockUpdateMyPrivateUserEquipment,
      deleteMyPrivateUserEquipment: mockDeleteMyPrivateUserEquipment
    }))
  };
});
let mockViewEquipment = jest.fn().mockResolvedValue(
  [[{equipment_id: 383}, {equipment_id: 5432}]]
);
let mockViewEquipmentById = jest.fn().mockResolvedValue(
  [[{equipment_id: 5432}]]
);
let mockCreateMyPrivateUserEquipment = jest.fn();
let mockUpdateMyPrivateUserEquipment = jest.fn();
let mockDeleteMyPrivateUserEquipment = jest.fn();

jest.mock('../../mysql-access/RecipeEquipment', () => {
  const originalModule = jest
  .requireActual('../../mysql-access/RecipeEquipment');
  return {
    ...originalModule,
    RecipeEquipment: jest.fn().mockImplementation(() => ({
      deleteRecipeEquipmentByEquipmentId: mockDeleteRecipeEquipmentByEquipmentId
    }))
  };
});
let mockDeleteRecipeEquipmentByEquipmentId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user equipment controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 150}};

  describe('viewAllMyPrivateUserEquipment method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{equipment_id: 383}, {equipment_id: 5432}]]
      )
    };

    it('uses viewEquipment correctly', async () => {
      await userEquipmentController
      .viewAllMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(mockViewEquipment).toHaveBeenCalledWith(150, 150);
    });

    it('sends data', async () => {
      await userEquipmentController
      .viewAllMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(res.send)
      .toBeCalledWith([[{equipment_id: 383}, {equipment_id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await userEquipmentController
      .viewAllMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(actual).toEqual([[{equipment_id: 383}, {equipment_id: 5432}]]);
    });
  });

  describe('viewMyPrivateUserEquipment method', () => {
    const req: Partial<Request> = {session, body: {equipmentId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([{equipment_id: 5432}])
    };

    it('uses viewEquipmentById correctly', async () => {
      await userEquipmentController
      .viewMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(mockViewEquipmentById).toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data', async () => {
      await userEquipmentController
      .viewMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([{equipment_id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userEquipmentController
      .viewMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(actual).toEqual([{equipment_id: 5432}]);
    });
  });

  describe('createMyPrivateUserEquipment method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          equipmentTypeId: 2,
          equipmentName: "My Equipment",
          equipmentDescription: "It works.",
          equipmentImage: "nobsc-equipment-default"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Equipment created.'})
    };

    it('uses createMyPrivateUserEquipment correctly', async () => {
      await userEquipmentController
      .createMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(mockCreateMyPrivateUserEquipment)
      .toHaveBeenCalledWith({
        equipmentTypeId: 2,
        authorId: 150,
        ownerId: 150,
        equipmentName: "My Equipment",
        equipmentDescription: "It works.",
        equipmentImage: "nobsc-equipment-default"
      });
    });

    it('sends data', async () => {
      await userEquipmentController
      .createMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Equipment created.'});
    });

    it('returns correctly', async () => {
      const actual = await userEquipmentController
      .createMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment created.'});
    });
  });

  describe('updateMyPrivateUserEquipment method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          equipmentId: 5432,
          equipmentTypeId: 2,
          equipmentName: "My Equipment",
          equipmentDescription: "It works.",
          equipmentImage: "nobsc-equipment-default"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Equipment updated.'})
    };

    it('uses updateMyPrivateUserEquipment correctly', async () => {
      await userEquipmentController
      .updateMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(mockUpdateMyPrivateUserEquipment)
      .toHaveBeenCalledWith({
        equipmentId: 5432,
        equipmentTypeId: 2,
        authorId: 150,
        ownerId: 150,
        equipmentName: "My Equipment",
        equipmentDescription: "It works.",
        equipmentImage: "nobsc-equipment-default"
      });
    });

    it('sends data', async () => {
      await userEquipmentController
      .updateMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Equipment updated.'});
    });

    it('returns correctly', async () => {
      const actual = await userEquipmentController
      .updateMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment updated.'});
    });
  });

  describe('deleteMyPrivateUserEquipment method', () => {
    const req: Partial<Request> = {session, body: {equipmentId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Equipment deleted.'})
    };

    it('uses deleteRecipeEquipmentByEquipmentId correctly', async () => {
      await userEquipmentController
      .deleteMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(mockDeleteRecipeEquipmentByEquipmentId)
      .toHaveBeenCalledWith(5432);
    });

    it('uses deleteRecipeEquipment correctly', async () => {
      await userEquipmentController
      .deleteMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(mockDeleteMyPrivateUserEquipment)
      .toHaveBeenCalledWith(5432, 150);
    });

    it('sends data', async () => {
      await userEquipmentController
      .deleteMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Equipment deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await userEquipmentController
      .deleteMyPrivateUserEquipment(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment deleted.'});
    });
  });

});