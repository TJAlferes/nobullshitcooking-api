require('dotenv').config();

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl }               from "@aws-sdk/s3-request-presigner";
import { Request, Response }          from 'express';
import { v4 as uuidv4 }               from 'uuid';

const BUCKETS = {
  AVATARS:            process.env.AWS_S3_AVATARS_BUCKET!,
  EQUIPMENT:          process.env.AWS_S3_EQUIPMENT_BUCKET!,
  INGREDIENTS:        process.env.AWS_S3_INGREDIENTS_BUCKET!,
  RECIPE:             process.env.AWS_S3_RECIPE_BUCKET!,
  RECIPE_COOKING:     process.env.AWS_S3_RECIPE_COOKING_BUCKET!,
  RECIPE_EQUIPMENT:   process.env.AWS_S3_RECIPE_EQUIPMENT_BUCKET!,
  RECIPE_INGREDIENTS: process.env.AWS_S3_RECIPE_INGREDIENTS_BUCKET!
};
const IDS = {
  AVATARS:            process.env.AWS_S3_AVATARS_ACCESS_KEY_ID!,
  EQUIPMENT:          process.env.AWS_S3_EQUIPMENT_ACCESS_KEY_ID!,
  INGREDIENTS:        process.env.AWS_S3_INGREDIENTS_ACCESS_KEY_ID!,
  RECIPE:             process.env.AWS_S3_RECIPE_ACCESS_KEY_ID!,
  RECIPE_COOKING:     process.env.AWS_S3_RECIPE_COOKING_ACCESS_KEY_ID!,
  RECIPE_EQUIPMENT:   process.env.AWS_S3_RECIPE_EQUIPMENT_ACCESS_KEY_ID!,
  RECIPE_INGREDIENTS: process.env.AWS_S3_RECIPE_INGREDIENTS_ACCESS_KEY_ID!
};
const KEYS = {
  AVATARS:            process.env.AWS_S3_AVATARS_SECRET_ACCESS_KEY!,
  EQUIPMENT:          process.env.AWS_S3_EQUIPMENT_SECRET_ACCESS_KEY!,
  INGREDIENTS:        process.env.AWS_S3_INGREDIENTS_SECRET_ACCESS_KEY!,
  RECIPE:             process.env.AWS_S3_RECIPE_SECRET_ACCESS_KEY!,
  RECIPE_COOKING:     process.env.AWS_S3_RECIPE_COOKING_SECRET_ACCESS_KEY!,
  RECIPE_EQUIPMENT:   process.env.AWS_S3_RECIPE_EQUIPMENT_SECRET_ACCESS_KEY!,
  RECIPE_INGREDIENTS: process.env.AWS_S3_RECIPE_INGREDIENTS_SECRET_ACCESS_KEY!
};
const region = "us-east-1";

export const UserSignedUrlController = {
  avatar: async function(req: Request, res: Response) {
    const fullName = `${req.session.userInfo!.username}`;
    const tinyName = `${fullName}-tiny`;

    const s3 = new S3Client({credentials: {accessKeyId: IDS.AVATARS, secretAccessKey: KEYS.AVATARS}, region});

    const fullSignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.AVATARS, Key: fullName, ContentType: "image/jpeg"}));
    const tinySignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.AVATARS, Key: tinyName, ContentType: "image/jpeg"}));

    return res.json({success: true, fullSignature, tinySignature, fullName});
  },

  equipment: async function(req: Request, res: Response) {
    const fullName = `${req.session.userInfo!.username}-${uuidv4()}`;
    const tinyName = `${fullName}-tiny`;

    const s3 = new S3Client({credentials: {accessKeyId: IDS.EQUIPMENT, secretAccessKey: KEYS.EQUIPMENT}, region});
  
    const fullSignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.EQUIPMENT, Key: fullName, ContentType: "image/jpeg"}));
    const tinySignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.EQUIPMENT, Key: tinyName, ContentType: "image/jpeg"}));
  
    return res.json({success: true, fullSignature, tinySignature, fullName});
  },

  ingredient: async function(req: Request, res: Response) {
    const fullName = `${req.session.userInfo!.username}-${uuidv4()}`;
    const tinyName = `${fullName}-tiny`;

    const s3 = new S3Client({credentials: {accessKeyId: IDS.INGREDIENTS, secretAccessKey: KEYS.INGREDIENTS}, region});
  
    const fullSignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.INGREDIENTS, Key: fullName, ContentType: "image/jpeg"}));
    const tinySignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.INGREDIENTS, Key: tinyName, ContentType: "image/jpeg"}));
  
    return res.json({success: true, fullSignature, tinySignature, fullName});
  },

  recipe: async function(req: Request, res: Response) {
    const fullName =  `${req.session.userInfo!.username}-${uuidv4()}`;
    const thumbName = `${fullName}-thumb`;
    const tinyName =  `${fullName}-tiny`;

    const s3 = new S3Client({credentials: {accessKeyId: IDS.RECIPE, secretAccessKey: KEYS.RECIPE}, region});
  
    const fullSignature =  await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.RECIPE, Key: fullName, ContentType: "image/jpeg"}));
    const thumbSignature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.RECIPE, Key: thumbName, ContentType: "image/jpeg"}));
    const tinySignature =  await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.RECIPE, Key: tinyName, ContentType: "image/jpeg"}));
  
    return res.json({success: true, fullSignature, thumbSignature, tinySignature, fullName});
  },

  recipeCooking: async function(req: Request, res: Response) {
    const name = `${req.session.userInfo!.username}-${uuidv4()}`;

    const s3 = new S3Client({credentials: {accessKeyId: IDS.RECIPE_COOKING, secretAccessKey: KEYS.RECIPE_COOKING}, region});
  
    const signature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.RECIPE_COOKING, Key: name, ContentType: "image/jpeg"}));
  
    return res.json({success: true, signature, name});
  },

  recipeEquipment: async function(req: Request, res: Response) {
    const name = `${req.session.userInfo!.username}-${uuidv4()}`;

    const s3 = new S3Client({credentials: {accessKeyId: IDS.RECIPE_EQUIPMENT, secretAccessKey: KEYS.RECIPE_EQUIPMENT}, region});
  
    const signature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.RECIPE_EQUIPMENT, Key: name, ContentType: "image/jpeg"}));
  
    return res.json({success: true, signature, name});
  },

  recipeIngredients: async function(req: Request, res: Response) {
    const name = `${req.session.userInfo!.username}-${uuidv4()}`;

    const s3 = new S3Client({credentials: {accessKeyId: IDS.RECIPE_INGREDIENTS, secretAccessKey: KEYS.RECIPE_INGREDIENTS}, region});
  
    const signature = await getSignedUrl(s3, new PutObjectCommand({Bucket: BUCKETS.RECIPE_INGREDIENTS, Key: name, ContentType: "image/jpeg"}));
  
    return res.json({success: true, signature, name});
  }
};