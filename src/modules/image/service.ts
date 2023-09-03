import { Image }              from "./model";
import { ImageRepoInterface } from "./repo";

export class ImageService {
  repo: ImageRepoInterface;

  constructor(repo: ImageRepoInterface) {
    this.repo = repo;
  }

  async bulkCreate({ author_id, owner_id, images }: BulkCreateParams) {
    if (!images) return;

    const placeholders = '(?, ?, ?, ?, ?),'
      .repeat(images.length)
      .slice(0, -1);

    const valid_images = images.map(image =>
      Image.create({
        author_id,
        owner_id,
        image_filename: image.image_filename,
        caption: image.caption
      }).getDTO()
    );

    await this.repo.bulkInsert({placeholders, images: valid_images});

    const image_ids = valid_images.map(image => image.image_id);

    return image_ids;
  }
}

type BulkCreateParams = {
  author_id: string;
  owner_id:  string;
  images:    ImageInfo[];
}

type ImageUpload = {
  image_filename: string;
  caption:        string;
  medium: null;
  thumb?: null;
};
