require('dotenv').config();

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl }               from "@aws-sdk/s3-request-presigner";
import { Request, Response }          from 'express';
import { uuidv7 }                     from 'uuidv7';

const region =                 "us-east-1";
const USER_BUCKET =            process.env.AWS_S3_USER_BUCKET!;
const USER_ACCESS_KEY_ID =     process.env.AWS_S3_USER_ACCESS_KEY_ID!;
const USER_SECRET_ACCESS_KEY = process.env.AWS_S3_USER_SECRET_ACCESS_KEY!;

export const userSignedUrlController = {
  s3RequestPresign: async function(req: Request, res: Response) {
    const subfolder: Subfolder = req.body.subfolder;  // TO DO: validate subfolder

    if (!req.session.userInfo!.user_id) return;

    const filename = uuidv7();

    const objectKey =
      `nobsc/image/user/${subfolder}${req.session.userInfo!.user_id}/${filename}`;

    const s3 = new S3Client({
      credentials: {
        accessKeyId:     USER_ACCESS_KEY_ID,
        secretAccessKey: USER_SECRET_ACCESS_KEY
      }, 
      region
    });

    if ( (subfolder === PUBLIC_RECIPE) || (subfolder === PRIVATE_RECIPE) ) {
      const fullSignature  = await sign(s3, objectKey, "full");
      const thumbSignature = await sign(s3, objectKey, "thumb");
      const tinySignature  = await sign(s3, objectKey, "tiny");
      return res.json({filename, fullSignature, thumbSignature, tinySignature});
    }

    if ( (subfolder === AVATAR)
      || (subfolder === PRIVATE_EQUIPMENT)
      || (subfolder === PRIVATE_INGREDIENT)
    ) {
      const fullSignature = await sign(s3, objectKey, "full");
      const tinySignature = await sign(s3, objectKey, "tiny");
      return res.json({filename, fullSignature, tinySignature});
    }

    if ( (subfolder === PUBLIC_RECIPE_COOKING)
      || (subfolder === PUBLIC_RECIPE_EQUIPMENT)
      || (subfolder === PUBLIC_RECIPE_INGREDIENTS)
      || (subfolder === PRIVATE_RECIPE_COOKING)
      || (subfolder === PRIVATE_RECIPE_EQUIPMENT)
      || (subfolder === PRIVATE_RECIPE_INGREDIENTS)
    ) {
      const fullSignature  = await sign(s3, objectKey, "full");
      return res.json({filename, fullSignature});
    }

    //throw new Error("Invalid request.");
  }
};

async function sign(s3: S3Client, objectKey: string, imageSize: string) {
  let Key = "";
  //if (imageSize === "large")  Key = `${objectKey}-large`;   // 
  if (imageSize === "medium") Key = `${objectKey}-medium`;  // 560/344
  if (imageSize === "small")  Key = `${objectKey}-small`;   // 280/172
  if (imageSize === "thumb") Key = `${objectKey}-thumb`;    // 100/62
  if (imageSize === "tiny")  Key = `${objectKey}-tiny`;     // 28/18

  const signature = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: USER_BUCKET,
    Key,
    ContentType: "image/jpeg"
  }));

  return signature;
}

type Subfolder =
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

const AVATAR                    = "public/avatar/" as const;
const PUBLIC_RECIPE             = "public/recipe/" as const;
const PUBLIC_RECIPE_COOKING     = "public/recipe-cooking/" as const;
const PUBLIC_RECIPE_EQUIPMENT   = "public/recipe-equipment/" as const;
const PUBLIC_RECIPE_INGREDIENTS = "public/recipe-ingredients/" as const;

const PRIVATE_EQUIPMENT          = "private/equipment/" as const;
const PRIVATE_INGREDIENT         = "private/ingredient/" as const;
const PRIVATE_RECIPE             = "private/recipe/" as const;
const PRIVATE_RECIPE_COOKING     = "private/recipe-cooking/" as const;
const PRIVATE_RECIPE_EQUIPMENT   = "private/recipe-equipment/" as const;
const PRIVATE_RECIPE_INGREDIENTS = "private/recipe-ingredients/" as const;

/*
objectKey =

nobsc/user/public/avatar/${user_id}.jpeg

nobsc/user/public/recipe/${user_id}/${uuidv7()}.jpeg

nobsc/user/private/equipment/${user_id}/${uuidv7()}.jpeg

nobsc/user/private/ingredient/${user_id}/${uuidv7()}.jpeg

nobsc/user/private/recipe/${user_id}/${uuidv7()}.jpeg
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
