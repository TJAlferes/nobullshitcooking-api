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
    // Be sure to read the AWS S3 docs. There aren't actually subbuckets. This is just a convention we decided to go with. Why?
    // Because we used to have seven S3 buckets. Now we consolidated them into one S3 bucket to make management a bit easier.
    // So we use this string as a way to maintain categories of user images.
    //
    // For example:
    //
    // We used to have a bucket for user avatar images, "nobsc-user-avatar", and another bucket for user recipe images, "nobsc-user-recipes":
    // https://s3.amazonaws.com/nobsc-user-avatar/someuser...
    // https://s3.amazonaws.com/nobsc-user-recipe/someuser-24kkiey13hd8damsd...
    //
    // Now we have only one bucket for all user images, "nobsc-user", and here, "avatar" and "recipe" are the subbuckets or categories.
    // https://s3.amazonaws.com/nobsc-user/avatar-someuser...
    // https://s3.amazonaws.com/nobsc-user/recipe-someuser-24kkiey13hd8damsd...
    const subBucket: SubBucket = req.body.subBucket;
    // use superstruct to validate here

    const s3 = new S3Client({credentials: {accessKeyId: USER_ACCESS_KEY_ID, secretAccessKey: USER_SECRET_ACCESS_KEY}, region});

    const fullName = (subBucket === "avatar")
      ? `${subBucket}-${req.session.userInfo!.username}`
      : `${subBucket}-${req.session.userInfo!.username}-${uuidv4()}`

    if ( (subBucket === "avatar") || (subBucket === "equipment") || (subBucket === "ingredient") ) {
      const tinyName = `${fullName}-tiny`;
      const fullSignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: fullName, ContentType: "image/jpeg"}));
      const tinySignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: tinyName, ContentType: "image/jpeg"}));
      return res.json({success: true, fullSignature, tinySignature, fullName});
    }

    if (subBucket === "recipe") {
      const thumbName = `${fullName}-thumb`;
      const tinyName = `${fullName}-tiny`;
      const fullSignature =  await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: fullName,  ContentType: "image/jpeg"}));
      const thumbSignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: thumbName, ContentType: "image/jpeg"}));
      const tinySignature =  await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: tinyName,  ContentType: "image/jpeg"}));
      return res.json({success: true, fullSignature, thumbSignature, tinySignature, fullName});
    }

    if ( (subBucket === "recipe-cooking") || (subBucket === "recipe-equipment") || (subBucket === "recipe-ingredients") ) {
      const name = fullName;
      const signature = await getSignedUrl(s3, new PutObjectCommand({Bucket: USER_BUCKET, Key: name, ContentType: "image/jpeg"}));
      return res.json({success: true, signature, name});
    }
  }
};

type SubBucket =
  | typeof AVATAR
  | typeof EQUIPMENT
  | typeof INGREDIENT
  | typeof RECIPE
  | typeof RECIPE_COOKING
  | typeof RECIPE_EQUIPMENT
  | typeof RECIPE_INGREDIENTS;

const AVATAR             = "avatar" as const;
const EQUIPMENT          = "equipment" as const;
const INGREDIENT         = "ingredient" as const;
const RECIPE             = "recipe" as const;
const RECIPE_COOKING     = "recipe-cooking" as const;
const RECIPE_EQUIPMENT   = "recipe-equipment" as const;
const RECIPE_INGREDIENTS = "recipe-ingredients" as const;
