import 'dotenv/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl }               from "@aws-sdk/s3-request-presigner";
import { Request, Response }          from 'express';
import { uuidv7 }                     from 'uuidv7';

import { UnauthorizedException, ValidationException } from '../../../utils/exceptions.js';

const s3 = new S3Client({
  credentials: {
    accessKeyId:     process.env.AWS_S3_PUBLIC_UPLOADS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_PUBLIC_UPLOADS_SECRET_ACCESS_KEY!
  }, 
  region: "us-east-1"
});

export const AwsS3PublicUploadsController = {
  // Allows users to upload their public images to AWS S3 directly from their browser,
  // so their images never have to pass through our server here.
  async createPresignedUrlToUploadImage(req: Request, res: Response) {
    if (!req.session.user_id) throw UnauthorizedException();

    if (!validSubfolders.includes(req.body.subfolder)) {
      throw ValidationException("Invalid subfolder.");
    }

    const subfolder: Subfolder = req.body.subfolder;
    const filename = uuidv7();  // ???
    const objectKey = `nobsc-public-uploads/${subfolder}${req.session.user_id}/${filename}`;
    
    if (subfolder === PUBLIC_RECIPE) {
      const mediumSignature = await sign(s3, objectKey, "medium");
      const thumbSignature  = await sign(s3, objectKey, "thumb");
      const tinySignature   = await sign(s3, objectKey, "tiny");

      return res.status(201).json({filename, mediumSignature, thumbSignature, tinySignature});
    }

    if (subfolder === PUBLIC_AVATAR) {
      const smallSignature = await sign(s3, objectKey, "small");
      const tinySignature  = await sign(s3, objectKey, "tiny");

      return res.status(201).json({filename, smallSignature, tinySignature});
    }

    if ( (subfolder === PUBLIC_RECIPE_COOKING)
      || (subfolder === PUBLIC_RECIPE_EQUIPMENT)
      || (subfolder === PUBLIC_RECIPE_INGREDIENTS)
    ) {
      const mediumSignature = await sign(s3, objectKey, "medium");

      return res.status(201).json({filename, mediumSignature});
    }
  }
};

async function sign(s3: S3Client, objectKey: string, imageSize: string) {
  const signature = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: process.env.AWS_S3_PUBLIC_UPLOADS_BUCKET!,
    Key: `${objectKey}-${imageSize}`,
    ContentType: "image/jpeg"
  }));

  return signature;
}

type Subfolder =
  | typeof PUBLIC_AVATAR
  | typeof PUBLIC_RECIPE
  | typeof PUBLIC_RECIPE_COOKING
  | typeof PUBLIC_RECIPE_EQUIPMENT
  | typeof PUBLIC_RECIPE_INGREDIENTS;

const PUBLIC_AVATAR             = "avatar/" as const;
const PUBLIC_RECIPE             = "recipe/" as const;
const PUBLIC_RECIPE_COOKING     = "recipe-cooking/" as const;
const PUBLIC_RECIPE_EQUIPMENT   = "recipe-equipment/" as const;
const PUBLIC_RECIPE_INGREDIENTS = "recipe-ingredients/" as const;

const validSubfolders = [
  PUBLIC_AVATAR,
  PUBLIC_RECIPE,
  PUBLIC_RECIPE_COOKING,
  PUBLIC_RECIPE_EQUIPMENT,
  PUBLIC_RECIPE_INGREDIENTS
];

/*
objectKey =
nobsc-public-uploads/  avatar/            ${user_id}/${uuidv7()}.jpeg
nobsc-public-uploads/  recipe/            ${user_id}/${uuidv7()}.jpeg
nobsc-public-uploads/  recipe-cooking/    ${user_id}/${uuidv7()}.jpeg
nobsc-public-uploads/  recipe-equipment/  ${user_id}/${uuidv7()}.jpeg
nobsc-public-uploads/  recipe-ingredients/${user_id}/${uuidv7()}.jpeg

imageSize =
large  (not yet used)
medium 560px by 560px  344
small  280px by 280px  172
thumb  100px by 100px   62
tiny    28px by  28px   18
*/

// Convert to lowercase,
// replace spaces with dashes,
// remove non-alphanumeric characters except dashes
/*function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}*/
