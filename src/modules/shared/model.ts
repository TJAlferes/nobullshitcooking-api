import { assert, defaulted, number, string } from 'superstruct';
import { uuidv7 } from 'uuidv7';

import { ValidationException } from '../../utils/exceptions';

export function GenerateUUIDv7StringId() {
  return uuidv7();
}

export function UUIDv7StringId(id: string) {
  assert(id, string());
  if (id.length !== 36) {
    throw ValidationException('Invalid ID.');
  }
  const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (pattern.test(id) === false) {
    throw ValidationException('Invalid ID.');
  }
  return id;
}

export function NumberId(id: number) {
  assert(id, number());
  return id;
}

export function Amount(amount: number) {
  assert(amount, number());
  return amount;
}

export function Notes(notes: string | undefined) {
  assert(notes, defaulted(string(), ''));
  if (!notes) notes = '';
  if (notes.length > 1000) {
    throw ValidationException('Notes must be no more than 1,000 characters.');
  }
  return notes;
}

export function ImageFilename(filename: string) {
  if (filename.length > 100) {
    throw ValidationException('Image filename must be no more than 100 characters.');
  }
  return filename;
}

export const UNKNOWN_USER_ID = '00000000-0000-0000-0000-000000000000';
export const NOBSC_USER_ID   = '11111111-1111-1111-1111-111111111111';
//'22222222-2222-2222-2222-222222222222'
