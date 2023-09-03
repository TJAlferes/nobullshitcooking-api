import { Image }              from "./model";
import { ImageRepoInterface } from "./repo";

export class ImageService {
  repo: ImageRepoInterface;

  constructor(repo: ImageRepoInterface) {
    this.repo = repo;
  }

  async bulkCreate({ author_id, owner_id, uploaded_images }: BulkCreateParams) {
    if (!uploaded_images) return;

    const placeholders = '(?, ?, ?, ?, ?),'
      .repeat(uploaded_images.length)
      .slice(0, -1);
    
    const images: ImageDTO[] = [];
    const associated_images: AssociatedImage[] = [];  // needed for recipe_image table (see: recipe controllers)
    
    uploaded_images.map(uploaded_image => {
      const image = Image.create({
        author_id,
        owner_id,
        image_filename: uploaded_image.image_filename,
        caption:        uploaded_image.caption
      }).getDTO();

      images.push(image);

      associated_images.push({
        image_id: image.image_id,
        type:     uploaded_image.type,
        order:    uploaded_image.order
      });
    });

    await this.repo.bulkInsert({placeholders, images});

    return associated_images;
  }
}

type BulkCreateParams = {
  author_id:       string;
  owner_id:        string;
  uploaded_images: ImageUpload[];
}

type ImageUpload = {
  image_filename: string;
  caption:        string;
  type:           number;
  order:          number;
  medium:         null;
  thumb?:         null;
  tiny?:          null;
};

type ImageDTO = {
  image_id:       string;
  image_filename: string;
  caption:        string;
  author_id:      string;
  owner_id:       string;
};

type AssociatedImage = {
  image_id: string;
  type:     number;
  order:    number;
};
