import { Request, Response } from 'express';

import { EquipmentSearch } from '../elasticsearch-access/EquipmentSearch';
import { IngredientSearch } from '../elasticsearch-access/IngredientSearch';
import { RecipeSearch } from '../elasticsearch-access/RecipeSearch';
import { searchController } from './search';

jest.mock('../elasticsearch/EquipmentSearch', () => ({
  EquipmentSearch: jest.fn().mockImplementation(() => ({
    autoEquipment: mockAutoEquipment,
    findEquipment: mockFindEquipment
  }))
}));
let mockAutoEquipment = jest.fn().mockResolvedValue({some: "value"});
let mockFindEquipment = jest.fn().mockResolvedValue({some: "value"});

jest.mock('../elasticsearch/IngredientSearch', () => ({
  IngredientSearch: jest.fn().mockImplementation(() => ({
    autoIngredients: mockAutoIngredients,
    findIngredients: mockFindIngredients
  }))
}));
let mockAutoIngredients = jest.fn().mockResolvedValue({some: "value"});
let mockFindIngredients = jest.fn().mockResolvedValue({some: "value"});

jest.mock('../elasticsearch/RecipeSearch', () => ({
  RecipeSearch: jest.fn().mockImplementation(() => ({
    autoRecipes: mockAutoRecipes,
    findRecipes: mockFindRecipes
  }))
}));
let mockAutoRecipes = jest.fn().mockResolvedValue({some: "value"});
let mockFindRecipes = jest.fn().mockResolvedValue({some: "value"});

afterEach(() => {
  jest.clearAllMocks();
});

describe('search controller', () => {
  describe('autocompletePublicAll method', () => {

  });

  describe('findPublicAll method', () => {

  });

  describe('autocompletePublicEquipment method', () => {

  });

  describe('findPublicEquipment method', () => {

  });

  describe('autocompletePublicIngredients method', () => {

  });

  describe('findPublicIngredients method', () => {

  });

  describe('autocompletePublicRecipes method', () => {

  });

  describe('findPublicRecipes method', () => {

  });
});