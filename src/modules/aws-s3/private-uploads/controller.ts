import 'dotenv/config';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl }               from "@aws-sdk/s3-request-presigner";
import { Request, Response }          from 'express';
import { uuidv7 }                     from 'uuidv7';

import { UnauthorizedException, ValidationException } from '../../../utils/exceptions.js';

const s3 = new S3Client({
  credentials: {
    accessKeyId:     process.env.AWS_S3_PRIVATE_UPLOADS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_PRIVATE_UPLOADS_SECRET_ACCESS_KEY!
  }, 
  region: "us-east-1"
});

export const AwsS3PrivateUploadsController = {
  // Allows users to upload their private images to AWS S3 directly from their browser,
  // so their images never have to pass through our server
  async createPresignedUrlToUploadImage(req: Request, res: Response) {
    if (!req.session.user_id) throw UnauthorizedException();

    if (!validSubfolders.includes(req.body.subfolder)) {
      throw ValidationException("Invalid subfolder.");
    }

    const subfolder: Subfolder = req.body.subfolder;
    const filename = uuidv7();  // ???
    const objectKey = `nobsc-private-uploads/${subfolder}${req.session.user_id}/${filename}`;
    
    if (subfolder === "recipe") {
      const mediumSignature = await sign(objectKey, "medium");
      const thumbSignature  = await sign(objectKey, "thumb");
      const tinySignature   = await sign(objectKey, "tiny");

      return res.status(201).json({filename, mediumSignature, thumbSignature, tinySignature});
    }

    if (subfolder === "equipment" || subfolder === "ingredient") {
      const smallSignature = await sign(objectKey, "small");
      const tinySignature  = await sign(objectKey, "tiny");

      return res.status(201).json({filename, smallSignature, tinySignature});
    }

    if ( subfolder === "recipe-cooking"
      || subfolder === "recipe-equipment"
      || subfolder === "recipe-ingredients"
    ) {
      const mediumSignature = await sign(objectKey, "medium");

      return res.status(201).json({filename, mediumSignature});
    }
  },

  // Allows users to view their private images
  async bulkCreatePresignedUrlToViewImages(req: Request, res: Response) {
    if (!req.session.user_id) throw UnauthorizedException();

    const signatures = [];

    for (const { subfolder, image_filename, size } of req.body) {
      if (!validSubfolders.includes(subfolder)) {
        throw ValidationException("Invalid subfolder.");
      }
  
      const signature = await getSignedUrl(s3, new GetObjectCommand({
        Bucket: process.env.AWS_S3_PRIVATE_UPLOADS_BUCKET!,
        Key: `
          nobsc-private-uploads
          /${subfolder}
          /${req.session.user_id}
          /${image_filename}-${size}
        `
      }));

      signatures.push(signature);
    }

    return res.status(201).json({signatures});
  },

  // Allows users to view their private image
  async createPresignedUrlToViewImage(req: Request, res: Response) {
    if (!req.session.user_id) throw UnauthorizedException();

    const { subfolder, image_filename, size } = req.body;

    if (!validSubfolders.includes(subfolder)) {
      throw ValidationException("Invalid subfolder.");
    }
  
    const signature = await getSignedUrl(s3, new GetObjectCommand({
      Bucket: process.env.AWS_S3_PRIVATE_UPLOADS_BUCKET!,
      Key: `
        nobsc-private-uploads
        /${subfolder}
        /${req.session.user_id}
        /${image_filename}-${size}
      `
    }));

    return res.status(201).json({signature});
  }
};

async function sign(objectKey: string, imageSize: string) {
  const signature = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: process.env.AWS_S3_PRIVATE_UPLOADS_BUCKET!,
    Key: `${objectKey}-${imageSize}`,
    ContentType: "image/jpeg"
  }));

  return signature;
}

const validSubfolders = [
  "equipment",
  "ingredient",
  "recipe",
  "recipe-cooking",
  "recipe-equipment",
  "recipe-ingredients"
];

type Subfolder =
  | "equipment"
  | "ingredient"
  | "recipe"
  | "recipe-cooking"
  | "recipe-equipment"
  | "recipe-ingredients";

/*
objectKey =
nobsc-private-uploads/  equipment/         ${user_id}/${uuidv7()}.jpeg
nobsc-private-uploads/  ingredient/        ${user_id}/${uuidv7()}.jpeg
nobsc-private-uploads/  recipe/            ${user_id}/${uuidv7()}.jpeg
nobsc-private-uploads/  recipe-cooking/    ${user_id}/${uuidv7()}.jpeg
nobsc-private-uploads/  recipe-equipment/  ${user_id}/${uuidv7()}.jpeg
nobsc-private-uploads/  recipe-ingredients/${user_id}/${uuidv7()}.jpeg

imageSize =
large  (not yet used)
medium 560px by 560px  344
small  280px by 280px  172
thumb  100px by 100px   62
tiny    28px by  28px   18
*/
