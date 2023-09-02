import { assert, string } from "superstruct";

import { GenerateUUIDv7StringId, UUIDv7StringId, ImageFilename } from "../shared/model";

export class Image {
  private image_id;
  private image_filename;
  private caption;
  private author_id;
  private owner_id;

  private constructor(params: ConstructorParams) {
    this.image_id       = UUIDv7StringId(params.image_id);
    this.image_filename = ImageFilename(params.image_filename);
    this.caption        = Caption(params.caption);
    this.author_id      = UUIDv7StringId(params.author_id);
    this.owner_id       = UUIDv7StringId(params.owner_id);
  }

  static create(params: CreateParams) {
    const image_id = GenerateUUIDv7StringId();
    return new Image({image_id, ...params});
  }

  //static update(params: UpdateParams) {} needed for images ???

  getDTO() {
    return {
      image_id:       this.image_id,
      image_filename: this.image_filename,
      caption:        this.caption,
      author_id:      this.author_id,
      owner_id:       this.owner_id
    };
  }
}

function Caption(caption: string) {
  assert(caption, string());
  if (caption.length > 150) {
    throw new Error("Caption must be no more than 100 characters.");
  }
  return caption;
}

type CreateParams = {
  image_filename: string;
  caption:        string;
  author_id:      string;
  owner_id:       string;
};

type UpdateParams = CreateParams & {
  image_id: string;
};

type ConstructorParams = UpdateParams;
