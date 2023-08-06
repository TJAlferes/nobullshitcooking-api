import { assert, defaulted, number, object, string } from 'superstruct';
import { uuidv7 }                                    from 'uuidv7';

export function Id() {
  return uuidv7();
}

export function AuthorId(authorId: string) {
  assert(authorId, string());
  return authorId;
}

export function OwnerId(ownerId: string) {
  assert(ownerId, string());
  return ownerId;
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
