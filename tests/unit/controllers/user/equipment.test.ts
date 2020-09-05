import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validEquipmentEntity
} from '../../../../src/lib/validations/equipment/equipmentEntity';
import { userEquipmentController } from '../../../../src/controllers/user/equipment';

jest.mock('superstruct');

jest.mock('../../../../src/mysql-access/Equipment', () => {
  const originalModule = jest.requireActual('../../../../src/mysql-access/Equipment');
  return {
    ...originalModule,
    Equipment: jest.fn().mockImplementation(() => ({
      view: mockView,
      viewById: mockViewById,
      createPrivate: mockCreatePrivate,
      updatePrivate: mockUpdatePrivate,
      deleteByOwnerId: mockDeleteByOwnerId
    }))
  };
});
let mockView = jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]]);
let mockViewById = jest.fn().mockResolvedValue([[{id: 5432}]]);
let mockCreatePrivate = jest.fn();
let mockUpdatePrivate = jest.fn();
let mockDeleteByOwnerId = jest.fn();

jest.mock('../../../../src/mysql-access/RecipeEquipment', () => {
  const originalModule = jest
  .requireActual('../../../../src/mysql-access/RecipeEquipment');
  return {
    ...originalModule,
    RecipeEquipment: jest.fn().mockImplementation(() => ({
      deleteByEquipmentId: mockDeleteByEquipmentId
    }))
  };
});
let mockDeleteByEquipmentId = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user equipment controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 150}};

  describe('view method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([[{id: 383}, {id: 5432}]])};

    it('uses view correctly', async () => {
      await userEquipmentController.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith(150, 150);
    });

    it('sends data corectly', async () => {
      await userEquipmentController.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([[{id: 383}, {id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual =
        await userEquipmentController.view(<Request>req, <Response>res);
      expect(actual).toEqual([[{id: 383}, {id: 5432}]]);
    });
  });

  describe('viewById method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: 5432}])};

    it('uses viewById correctly', async () => {
      await userEquipmentController.viewById(<Request>req, <Response>res);
      expect(mockViewById).toHaveBeenCalledWith(5432, 150, 150);
    });

    it('sends data correctly', async () => {
      await userEquipmentController.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual =
        await userEquipmentController.viewById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: 5432}]);
    });
  });

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          equipmentTypeId: 2,
          name: "My Equipment",
          description: "It works.",
          image: "nobsc-equipment-default"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment created.'})};

    it('uses assert correctly', async () => {
      await userEquipmentController.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          equipmentTypeId: 2,
          authorId: 150,
          ownerId: 150,
          name: "My Equipment",
          description: "It works.",
          image: "nobsc-equipment-default"
        },
        validEquipmentEntity
      );
    });

    it('uses create correctly', async () => {
      await userEquipmentController.create(<Request>req, <Response>res);
      expect(mockCreatePrivate).toHaveBeenCalledWith({
        equipmentTypeId: 2,
        authorId: 150,
        ownerId: 150,
        name: "My Equipment",
        description: "It works.",
        image: "nobsc-equipment-default"
      });
    });

    it('sends data correctly', async () => {
      await userEquipmentController.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment created.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userEquipmentController.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          id: 5432,
          equipmentTypeId: 2,
          name: "My Equipment",
          description: "It works.",
          image: "nobsc-equipment-default"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment updated.'})};

    it('uses validation correctly', async () => {
      await userEquipmentController.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          equipmentTypeId: 2,
          authorId: 150,
          ownerId: 150,
          name: "My Equipment",
          description: "It works.",
          image: "nobsc-equipment-default"
        },
        validEquipmentEntity
      );
    });

    it('uses update correctly', async () => {
      await userEquipmentController.update(<Request>req, <Response>res);
      expect(mockUpdatePrivate).toHaveBeenCalledWith({
        id: 5432,
        equipmentTypeId: 2,
        authorId: 150,
        ownerId: 150,
        name: "My Equipment",
        description: "It works.",
        image: "nobsc-equipment-default"
      });
    });

    it('sends data correctly', async () => {
      await userEquipmentController.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment updated.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userEquipmentController.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: 5432}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment deleted.'})};

    it('uses deleteByEquipmentId correctly', async () => {
      await userEquipmentController.delete(<Request>req, <Response>res);
      expect(mockDeleteByEquipmentId).toHaveBeenCalledWith(5432);
    });

    it('uses delete correctly', async () => {
      await userEquipmentController.delete(<Request>req, <Response>res);
      expect(mockDeleteByOwnerId).toHaveBeenCalledWith(5432, 150);
    });

    it('sends data correctly', async () => {
      await userEquipmentController.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment deleted.'});
    });

    it('returns correctly', async () => {
      const actual =
        await userEquipmentController.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment deleted.'});
    });
  });

});