import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { validPlanEntity } from '../../lib/validations/plan/planEntity';
import { userPlanController } from './plan';

jest.mock('superstruct');

jest.mock('../../mysql-access/Plan', () => {
  const originalModule = jest.requireActual('../../mysql-access/Plan');
  return {
    ...originalModule,
    Plan: jest.fn().mockImplementation(() => ({
      viewAllMyPrivatePlans: mockViewAllMyPrivatePlans,
      viewMyPrivatePlan: mockViewMyPrivatePlan,
      createMyPrivatePlan: mockCreateMyPrivatePlan,
      updateMyPrivatePlan: mockUpdateMyPrivatePlan,
      deleteMyPrivatePlan: mockDeleteMyPrivatePlan
    }))
  };
});
let mockViewAllMyPrivatePlans = jest.fn().mockResolvedValue(
  [[{plan_id: 383}, {plan_id: 5432}]]
);
let mockViewMyPrivatePlan = jest.fn().mockResolvedValue([[{plan_id: 5432}]]);
let mockCreateMyPrivatePlan = jest.fn();
let mockUpdateMyPrivatePlan = jest.fn();
let mockDeleteMyPrivatePlan = jest.fn();

describe('user plan controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 150}};

  describe('viewAllMyPrivatePlans method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([[{plan_id: 383}, {plan_id: 5432}]])
    };

    it('uses viewAllMyPrivatePlans correctly', async () => {
      await userPlanController
      .viewAllMyPrivatePlans(<Request>req, <Response>res);
      expect(mockViewAllMyPrivatePlans).toHaveBeenCalledWith(150);
    });

    it('sends data correctly', async () => {
      await userPlanController
      .viewAllMyPrivatePlans(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([[{plan_id: 383}, {plan_id: 5432}]]);
    });

    it('returns correctly', async () => {
      const actual = await userPlanController
      .viewAllMyPrivatePlans(<Request>req, <Response>res);
      expect(actual).toEqual([[{plan_id: 383}, {plan_id: 5432}]]);
    });
  });

  describe('viewMyPrivatePlan method', () => {
    const req: Partial<Request> = {session, body: {planId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue([{plan_id: 5432}])
    };

    it('uses viewMyPrivatePlan correctly', async () => {
      await userPlanController.viewMyPrivatePlan(<Request>req, <Response>res);
      expect(mockViewMyPrivatePlan).toHaveBeenCalledWith(5432, 150);
    });

    it('sends data correctly', async () => {
      await userPlanController.viewMyPrivatePlan(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([{plan_id: 5432}]);
    });

    it('returns correctly', async () => {
      const actual = await userPlanController
      .viewMyPrivatePlan(<Request>req, <Response>res);
      expect(actual).toEqual([{plan_id: 5432}]);
    });
  });

  describe('createMyPrivatePlan method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        planInfo: {
          planName: "Name",
          planData: "{some: data}"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Plan created.'})
    };

    it('uses assert correctly', async () => {
      await userPlanController.createMyPrivatePlan(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          authorId: 150,
          ownerId: 150,
          planName: "Name",
          planData: "{some: data}"
        },
        validPlanEntity
      );
    });

    it('uses createMyPrivatePlan correctly', async () => {
      await userPlanController.createMyPrivatePlan(<Request>req, <Response>res);
      expect(mockCreateMyPrivatePlan).toHaveBeenCalledWith({
        authorId: 150,
        ownerId: 150,
        planName: "Name",
        planData: "{some: data}"
      });
    });

    it('sends data correctly', async () => {
      await userPlanController.createMyPrivatePlan(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Plan created.'});
    });

    it('returns correctly', async () => {
      const actual = await userPlanController
      .createMyPrivatePlan(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Plan created.'});
    });
  });

  describe('updateMyPrivatePlan method', () => {
    const req: Partial<Request> = {
      session,
      body: {
        planInfo: {
          planId: 5432,
          planName: "Name",
          planData: "{some: data}"
        }
      }
    };
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Plan updated.'})
    };

    it('uses assert correctly', async () => {
      await userPlanController.updateMyPrivatePlan(<Request>req, <Response>res);
      expect(assert).toBeCalledWith(
        {
          authorId: 150,
          ownerId: 150,
          planName: "Name",
          planData: "{some: data}"
        },
        validPlanEntity
      );
    });

    it('uses updateMyPrivatePlan correctly', async () => {
      await userPlanController.updateMyPrivatePlan(<Request>req, <Response>res);
      expect(mockUpdateMyPrivatePlan).toHaveBeenCalledWith({
        planId: 5432,
        authorId: 150,
        ownerId: 150,
        planName: "Name",
        planData: "{some: data}"
      });
    });

    it('sends data correctly', async () => {
      await userPlanController.updateMyPrivatePlan(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Plan updated.'});
    });

    it('returns correctly', async () => {
      const actual = await userPlanController
      .updateMyPrivatePlan(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Plan updated.'});
    });
  });

  describe('deleteMyPrivatePlan method', () => {
    const req: Partial<Request> = {session, body: {planId: 5432}};
    const res: Partial<Response> = {
      send: jest.fn().mockResolvedValue({message: 'Plan deleted.'})
    };

    it('uses deleteMyPrivatePlan correctly', async () => {
      await userPlanController.deleteMyPrivatePlan(<Request>req, <Response>res);
      expect(mockDeleteMyPrivatePlan).toHaveBeenCalledWith(5432, 150);
    });

    it('sends data correctly', async () => {
      await userPlanController.deleteMyPrivatePlan(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith({message: 'Plan deleted.'});
    });

    it('returns correctly', async () => {
      const actual = await userPlanController
      .deleteMyPrivatePlan(<Request>req, <Response>res);
      expect(actual).toEqual({message: 'Plan deleted.'});
    });
  });

});