import 'dotenv/config';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Request, Response } from 'express';
import { uuidv7 } from 'uuidv7';

import { UnauthorizedException, ValidationException } from '../../../utils/exceptions';
import { AwsS3PrivateUploadsClient } from './client';

export const AwsS3PrivateUploadsController = {
  // Allows users to upload their private images to AWS S3 directly from their browser,
  // so their images never have to pass through our server
  async signUrlToUploadImage(req: Request, res: Response) {
    if (!req.session.user_id) throw new UnauthorizedException();

    if (!validSubfolders.includes(req.body.subfolder)) {
      throw new ValidationException('Invalid subfolder.');
    }

    const subfolder: Subfolder = req.body.subfolder;
    const filename = uuidv7();
    const objectKey = `${subfolder}/${req.session.user_id}/${filename}`;
    
    if (subfolder === 'recipe') {
      const mediumSignature = await sign(objectKey, 'medium');
      const smallSignature  = await sign(objectKey, 'small');
      const tinySignature   = await sign(objectKey, 'tiny');

      return res.status(201).json({filename, mediumSignature, smallSignature, tinySignature});
    }

    if (subfolder === 'equipment' || subfolder === 'ingredient') {
      const smallSignature = await sign(objectKey, 'small');
      const tinySignature  = await sign(objectKey, 'tiny');

      return res.status(201).json({filename, smallSignature, tinySignature});
    }

    if ( subfolder === 'recipe-cooking'
      || subfolder === 'recipe-equipment'
      || subfolder === 'recipe-ingredients'
    ) {
      const mediumSignature = await sign(objectKey, 'medium');

      return res.status(201).json({filename, mediumSignature});
    }
  },

  // Allows users to view their private images
  async signUrlToViewImages(req: Request, res: Response) {
    if (!req.session.user_id) throw new UnauthorizedException();

    const signatures = [];

    for (const { subfolder, image_filename, size } of req.body.access_requests) {
      if (!validSubfolders.includes(subfolder)) {
        throw new ValidationException('Invalid subfolder.');
      }
  
      const signature = await getSignedUrl(AwsS3PrivateUploadsClient, new GetObjectCommand({
        Bucket: 'nobsc-private-uploads',
        Key: `${subfolder}/${req.session.user_id}/${image_filename}-${size}.jpg`
      }));

      signatures.push(signature);
    }

    return res.status(201).json({signatures});
  },

  // Allows users to view their private image
  async signUrlToViewImage(req: Request, res: Response) {
    if (!req.session.user_id) throw new UnauthorizedException();

    const { subfolder, image_filename, size } = req.body;

    if (!validSubfolders.includes(subfolder)) {
      throw new ValidationException('Invalid subfolder.');
    }
  
    const signature = await getSignedUrl(AwsS3PrivateUploadsClient, new GetObjectCommand({
      Bucket: 'nobsc-private-uploads',
      Key: `${subfolder}/${req.session.user_id}/${image_filename}-${size}.jpg`
    }));

    return res.status(201).json({signature});
  }
};

async function sign(objectKey: string, imageSize: string) {
  const signature = await getSignedUrl(AwsS3PrivateUploadsClient, new PutObjectCommand({
    Bucket: 'nobsc-private-uploads',
    Key: `${objectKey}-${imageSize}.jpg`,
    ContentType: 'image/jpeg'
  }));

  return signature;
}

const validSubfolders = [
  'equipment',
  'ingredient',
  'recipe',
  'recipe-cooking',
  'recipe-equipment',
  'recipe-ingredients'
];

type Subfolder =
  | 'equipment'
  | 'ingredient'
  | 'recipe'
  | 'recipe-cooking'
  | 'recipe-equipment'
  | 'recipe-ingredients';

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
medium 560px by 560px
small  280px by 280px
thumb  100px by 100px
tiny    28px by  28px
*/
