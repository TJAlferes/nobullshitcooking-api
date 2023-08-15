import { assert, defaulted, number, string } from 'superstruct';
import { uuidv7 }                    from 'uuidv7';

export function GenerateId() {
  return uuidv7();
}

export function UUIDv7StringId(id: string) {
  assert(id, string());
  if (id.length !== 36) {
    throw new Error("Invalid ID.");
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

export function Description(description: string) {
  assert(description, string());
  return description;
}

export function Image(image: string) {
  assert(image, defaulted(string(), ''));
  if (image.length > 100) {
    throw new Error("Image URL must be no more than 100 characters.");
  }
  return image;
}
