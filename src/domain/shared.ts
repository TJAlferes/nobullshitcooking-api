import { assert, defaulted, number, object, string } from 'superstruct';
import { uuidv7 }                                    from 'uuidv7';

export function GenerateId() {
  return uuidv7();
}

export function Id(id: string) {
  assert(id, string());
  return id;
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
