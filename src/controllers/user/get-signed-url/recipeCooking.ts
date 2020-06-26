require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';  // do in React instead?
import S3 from 'aws-sdk/clients/s3';
import { Request, Response } from 'express';

import { getSignedUrlPromise } from '../../../lib/utils/getSignedUrlPromise';

const AWS_NOBSC_USER_RECIPE_COOKING_S3_BUCKET: string =
process.env.AWS_NOBSC_USER_RECIPE_COOKING_S3_BUCKET!;

export async function getSignedUrlRecipeCooking(req: Request, res: Response) {
  const fileNameFullSize = `${req.session!.userInfo.username}-${uuidv4()}`;
  const fileType = req.body.fileType;

  const s3 = new S3({
    accessKeyId: process.env.AWS_NOBSC_USER_RECIPE_COOKING_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_NOBSC_USER_RECIPE_COOKING_SECRET_ACCESS_KEY
  });

  const signatureFullSize = await getSignedUrlPromise(s3, 'putObject', {
    Bucket: AWS_NOBSC_USER_RECIPE_COOKING_S3_BUCKET,
    Key: fileNameFullSize,
    ContentType: fileType,
    Expires: 50
  });

  res.json({
    success: true,
    signedRequestFullSize: signatureFullSize,
    urlFullSize: fileNameFullSize
  });
};