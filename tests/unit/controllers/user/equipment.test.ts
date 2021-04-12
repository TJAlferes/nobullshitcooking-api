import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { UserEquipmentController } from '../../../../src/controllers/user';
import {
  validEquipmentEntity
} from '../../../../src/lib/validations/equipment/entity';

const pool: Partial<Pool> = {};
const controller = new UserEquipmentController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql', () => ({
  Equipment: jest.fn().mockImplementation(() => ({
    view: mockView,
    viewById: mockViewById,
    createPrivate: mockCreatePrivate,
    updatePrivate: mockUpdatePrivate,
    deleteByOwner: mockDeleteByOwner
  })),
  RecipeEquipment: jest.fn().mockImplementation(() => ({
    deleteByEquipment: mockDeleteByEquipment
  }))
}));
let mockView = jest.fn().mockResolvedValue(
  [[{id: "Name My Equipment 1"}, {id: "Name My Equipment 2"}]]
);
let mockViewById = jest.fn().mockResolvedValue([[{id: "Name My Equipment 2"}]]);
let mockCreatePrivate = jest.fn();
let mockUpdatePrivate = jest.fn();
let mockDeleteByOwner = jest.fn();

let mockDeleteByEquipment = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user equipment controller', () => {
  const session = {...<Express.Session>{}, userInfo: {username: "Name"}};

  describe('view method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue(
        [[{id: "Name My Equipment 1"}, {id: "Name My Equipment 2"}]]
      )
    };

    it('uses view correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith("Name", "Name");
    });

    it('sends data corectly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(
        [[{id: "Name My Equipment 1"}, {id: "Name My Equipment 2"}]]
      );
    });

    it('returns correctly', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(actual)
        .toEqual([[{id: "Name My Equipment 1"}, {id: "Name My Equipment 2"}]]);
    });
  });

  describe('viewById method', () => {
    const req: Partial<Request> = {session, body: {id: "Name My Equipment 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue([{id: "Name My Equipment 2"}])};

    it('uses viewById correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(mockViewById)
        .toHaveBeenCalledWith("Name My Equipment 2", "Name", "Name");
    });

    it('sends data correctly', async () => {
      await controller.viewById(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([{id: "Name My Equipment 2"}]);
    });

    it('returns correctly', async () => {
      const actual = await controller.viewById(<Request>req, <Response>res);
      expect(actual).toEqual([{id: "Name My Equipment 2"}]);
    });
  });

  describe('create method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          type: "Type",
          name: "My Equipment",
          description: "It works.",
          image: "nobsc-equipment-default"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment created.'})};

    it('uses assert correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          type: "Type",
          author: "Name",
          owner: "Name",
          name: "My Equipment",
          description: "It works.",
          image: "nobsc-equipment-default"
        },
        validEquipmentEntity
      );
    });

    it('uses create correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(mockCreatePrivate).toHaveBeenCalledWith({
        type: "Type",
        author: "Name",
        owner: "Name",
        name: "My Equipment",
        description: "It works.",
        image: "nobsc-equipment-default"
      });
    });

    it('sends data correctly', async () => {
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment created.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.create(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment created.'});
    });
  });

  describe('update method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        equipmentInfo: {
          id: "Name My Equipment 2",
          type: "Type",
          name: "My Equipment",
          description: "It works.",
          image: "nobsc-equipment-default"
        }
      }
    };
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment updated.'})};

    it('uses validation correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(assert).toHaveBeenCalledWith(
        {
          type: "Type",
          author: "Name",
          owner: "Name",
          name: "My Equipment",
          description: "It works.",
          image: "nobsc-equipment-default"
        },
        validEquipmentEntity
      );
    });

    it('uses update correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(mockUpdatePrivate).toHaveBeenCalledWith({
        id: "Name My Equipment 2",
        type: "Type",
        author: "Name",
        owner: "Name",
        name: "My Equipment",
        description: "It works.",
        image: "nobsc-equipment-default"
      });
    });

    it('sends data correctly', async () => {
      await controller.update(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment updated.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.update(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment updated.'});
    });
  });

  describe('delete method', () => {
    const req: Partial<Request> = {session, body: {id: "Name My Equipment 2"}};
    const res: Partial<Response> =
      {send: jest.fn().mockResolvedValue({message: 'Equipment deleted.'})};

    it('uses deleteByEquipmentId correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteByEquipment)
        .toHaveBeenCalledWith("Name My Equipment 2");
    });

    it('uses delete correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(mockDeleteByOwner)
        .toHaveBeenCalledWith("Name My Equipment 2", "Name");
    });

    it('sends data correctly', async () => {
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Equipment deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await controller.delete(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Equipment deleted.'});
    });
  });

});