import { assert, string } from "superstruct";

import { GenerateUUIDv7StringId, UUIDv7StringId } from "../shared/model";

export class Image {
  private image_id;
  private image_url;
  private alt_text;
  private caption;

  private constructor(params: ConstructorParams) {
    this.image_id  = UUIDv7StringId(params.image_id);
    this.image_url = ImageUrl(params.image_url);
    this.alt_text  = AltText(params.alt_text);
    this.caption   = Caption(params.caption);
  }

  static create(params: CreateParams) {
    const image_id = GenerateUUIDv7StringId();
    return new Image({image_id, ...params});
  }

  static update(params: UpdateParams) {

  }

  getDTO() {
    return {
      image_id:  this.image_id,
      image_url: this.image_url,
      alt_text:  this.alt_text,
      caption:   this.caption
    };
  }
}

function ImageUrl(url: string) {
  assert(url, string());
  //
  return url;
}

function AltText(text: string) {
  assert(text, string());
  //
  return text;
}

function Caption(caption: string) {
  assert(caption, string());
  //
  return caption;
}

type CreateParams = {
  image_url: string;
  alt_text:  string;
  caption:   string;
};

type UpdateParams = CreateParams & {
  image_id: string;
};

type ConstructorParams = UpdateParams;
