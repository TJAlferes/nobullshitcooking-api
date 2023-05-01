require('dotenv').config();

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl }               from "@aws-sdk/s3-request-presigner";
import { Request, Response }          from 'express';
import { v4 as uuidv4 }               from 'uuid';

const region =                 "us-east-1";
const USER_BUCKET =            process.env.AWS_S3_USER_BUCKET!;
const USER_ACCESS_KEY_ID =     process.env.AWS_S3_USER_ACCESS_KEY_ID!;
const USER_SECRET_ACCESS_KEY = process.env.AWS_S3_USER_SECRET_ACCESS_KEY!;

export const UserSignedUrlController = {
  s3RequestPresign: async function(req: Request, res: Response) {
    const folder: Folder = req.body.folder;
    const filename = slugify(req.body.filename);  // name/fullname/title
    // TO DO: use superstruct to validate folder and filename

    const s3 = new S3Client({
      credentials: {
        accessKeyId:     USER_ACCESS_KEY_ID,
        secretAccessKey: USER_SECRET_ACCESS_KEY
      }, 
      region
    });

    const objectKey = (folder === AVATAR)
      ? `${folder}${req.session.userInfo!.username}`
      : `${folder}${req.session.userInfo!.username}/${filename}-${uuidv4()}`;

    if ( (folder === AVATAR) || (folder === PRIVATE_EQUIPMENT) || (folder === PRIVATE_INGREDIENT) ) {
      const fullSignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: objectKey,           ContentType: "image/jpeg"}));
      const tinySignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: `${objectKey}-tiny`, ContentType: "image/jpeg"}));
      return res.json({success: true, fullSignature, tinySignature, objectKey});
    }

    if ( (folder === PUBLIC_RECIPE) || (folder === PRIVATE_RECIPE) ) {
      const fullSignature =  await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: objectKey,            ContentType: "image/jpeg"}));
      const thumbSignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: `${objectKey}-thumb`, ContentType: "image/jpeg"}));
      const tinySignature =  await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: `${objectKey}-tiny`,  ContentType: "image/jpeg"}));
      return res.json({success: true, fullSignature, thumbSignature, tinySignature, objectKey});
    }

    if ( (folder === PUBLIC_RECIPE_COOKING)
      || (folder === PUBLIC_RECIPE_EQUIPMENT)
      || (folder === PUBLIC_RECIPE_INGREDIENTS)
      || (folder === PRIVATE_RECIPE_COOKING)
      || (folder === PRIVATE_RECIPE_EQUIPMENT)
      || (folder === PRIVATE_RECIPE_INGREDIENTS)
    ) {
      const fullSignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: objectKey, ContentType: "image/jpeg"}));
      return res.json({success: true, fullSignature, objectKey});
    }
  }
};

// Convert to lowercase, replace spaces with dashes, remove non-alphanumeric characters except dashes
function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

type Folder =
  | typeof AVATAR
  | typeof PUBLIC_RECIPE
  | typeof PUBLIC_RECIPE_COOKING
  | typeof PUBLIC_RECIPE_EQUIPMENT
  | typeof PUBLIC_RECIPE_INGREDIENTS
  | typeof PRIVATE_EQUIPMENT
  | typeof PRIVATE_INGREDIENT
  | typeof PRIVATE_RECIPE
  | typeof PRIVATE_RECIPE_COOKING
  | typeof PRIVATE_RECIPE_EQUIPMENT
  | typeof PRIVATE_RECIPE_INGREDIENTS;

const AVATAR                    = "nobsc/image/user/public/avatar/" as const;
const PUBLIC_RECIPE             = "nobsc/image/user/public/recipe/" as const;
const PUBLIC_RECIPE_COOKING     = "nobsc/image/user/public/recipe-cooking/" as const;
const PUBLIC_RECIPE_EQUIPMENT   = "nobsc/image/user/public/recipe-equipment/" as const;
const PUBLIC_RECIPE_INGREDIENTS = "nobsc/image/user/public/recipe-ingredients/" as const;

const PRIVATE_EQUIPMENT          = "nobsc/image/user/private/equipment/" as const;
const PRIVATE_INGREDIENT         = "nobsc/image/user/private/ingredient/" as const;
const PRIVATE_RECIPE             = "nobsc/image/user/private/recipe/" as const;
const PRIVATE_RECIPE_COOKING     = "nobsc/image/user/private/recipe-cooking/" as const;
const PRIVATE_RECIPE_EQUIPMENT   = "nobsc/image/user/private/recipe-equipment/" as const;
const PRIVATE_RECIPE_INGREDIENTS = "nobsc/image/user/private/recipe-ingredients/" as const;

/*
    
    objectKey =
    nobsc/user/public/avatar/${username}.jpeg
    nobsc/user/public/recipe/${username}/${title}-${uuidv4()}.jpeg

    nobsc/user/private/equipment/${username}/${name}-${uuidv4()}.jpeg
    nobsc/user/private/ingredient/${username}/${fullname}-${uuidv4()}.jpeg
    nobsc/user/private/recipe/${username}/${title}-${uuidv4()}.jpeg

    TO DO: you have Private and Public, but you should also make (Accepted)FriendsOnly

    */
