import { Image }              from "./model";
import { ImageRepoInterface } from "./repo";

export class ImageService {
  repo: ImageRepoInterface;

  constructor(repo: ImageRepoInterface) {
    this.repo = repo;
  }

  async bulkCreate(images: ImageInfo[]) {
    if (!images) return;

    const placeholders = '(?, ?, ?, ?, ?),'
      .repeat(images.length)
      .slice(0, -1);

    const valid_images = images.map(image =>
      Image.create(image).getDTO()
    );

    await this.repo.bulkInsert({placeholders, images: valid_images});

    const image_ids = valid_images.map(image => image.image_id);

    return image_ids;
  }
}

type ImageInfo = {
  image_filename: string;
  caption:        string;
  author_id:      string;
  owner_id:       string;
};
