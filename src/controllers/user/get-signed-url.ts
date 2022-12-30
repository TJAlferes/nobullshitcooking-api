require('dotenv').config();
import { S3Client } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { getSignedUrlPromise } from '../../lib/utils';

const AWS_S3_BUCKETS = {
  AVATAR:             process.env.AWS_S3_AVATAR_BUCKET!,
  CONTENT:            process.env.AWS_S3_CONTENT_BUCKET!,
  EQUIPMENT:          process.env.AWS_S3_EQUIPMENT_BUCKET!,
  INGREDIENT:         process.env.AWS_S3_INGREDIENT_BUCKET!,
  RECIPE:             process.env.AWS_S3_RECIPE_BUCKET!,
  RECIPE_COOKING:     process.env.AWS_S3_RECIPE_COOKING_BUCKET!,
  RECIPE_EQUIPMENT:   process.env.AWS_S3_RECIPE_EQUIPMENT_BUCKET!,
  RECIPE_INGREDIENTS: process.env.AWS_S3_RECIPE_INGREDIENTS_BUCKET!
};

export const getSignedUrl = {
  avatar: async function(req: Request, res: Response) {
    const fullName =     `${req.session.userInfo!.username}`;
    const tinyName =     `${fullName}-tiny`;
    const { fileType } = req.body;

    const s3 = new S3Client({accessKeyId: process.env.AWS_S3_AVATAR_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_S3_AVATAR_SECRET_ACCESS_KEY});

    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.AVATAR, Key: fullName, ContentType: fileType, Expires: 50});
    const tinySignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.AVATAR, Key: tinyName, ContentType: fileType, Expires: 50});

    return res.json({success: true, fullSignature, tinySignature, fullName});
  },

  content: async function(req: Request, res: Response) {
    const fullName =     `${req.session.userInfo!.username}-${uuidv4()}`;
    const thumbName =    `${fullName}-thumb`;
    const { fileType } = req.body;
  
    const s3 = new S3Client({accessKeyId: process.env.AWS_S3_CONTENT_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_S3_CONTENT_SECRET_ACCESS_KEY});
  
    const fullSignature =  await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.CONTENT, Key: fullName, ContentType: fileType, Expires: 50});
    const thumbSignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.CONTENT, Key: thumbName, ContentType: fileType, Expires: 50});
  
    return res.json({success: true, fullSignature, thumbSignature, fullName});
  },

  equipment: async function(req: Request, res: Response) {
    const fullName =     `${req.session.userInfo!.username}-${uuidv4()}`;
    const tinyName =     `${fullName}-tiny`;
    const { fileType } = req.body;
  
    const s3 = new S3Client({accessKeyId: process.env.AWS_S3_EQUIPMENT_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_S3_EQUIPMENT_SECRET_ACCESS_KEY});
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.EQUIPMENT, Key: fullName, ContentType: fileType, Expires: 50});
    const tinySignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.EQUIPMENT, Key: tinyName, ContentType: fileType, Expires: 50});
  
    return res.json({success: true, fullSignature, tinySignature, fullName});
  },

  ingredient: async function(req: Request, res: Response) {
    const fullName =     `${req.session.userInfo!.username}-${uuidv4()}`;
    const tinyName =     `${fullName}-tiny`;
    const { fileType } = req.body;
  
    const s3 = new S3Client({accessKeyId: process.env.AWS_S3_INGREDIENT_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_S3_INGREDIENT_SECRET_ACCESS_KEY});
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.INGREDIENT, Key: fullName, ContentType: fileType, Expires: 50});
    const tinySignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.INGREDIENT, Key: tinyName, ContentType: fileType, Expires: 50});
  
    return res.json({success: true, fullSignature, tinySignature, fullName});
  },

  recipe: async function(req: Request, res: Response) {
    const fullName =     `${req.session.userInfo!.username}-${uuidv4()}`;
    const thumbName =    `${fullName}-thumb`;
    const tinyName =     `${fullName}-tiny`;
    const { fileType } = req.body;
  
    const s3 = new S3Client({accessKeyId: process.env.AWS_S3_RECIPE_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_S3_RECIPE_SECRET_ACCESS_KEY});
  
    const fullSignature =  await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.RECIPE, Key: fullName, ContentType: fileType, Expires: 50});
    const thumbSignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.RECIPE, Key: thumbName, ContentType: fileType, Expires: 50});
    const tinySignature =  await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.RECIPE, Key: tinyName, ContentType: fileType, Expires: 50});
  
    return res.json({success: true, fullSignature, thumbSignature, tinySignature, fullName});
  },

  recipeCooking: async function(req: Request, res: Response) {
    const fullName =     `${req.session.userInfo!.username}-${uuidv4()}`;
    const { fileType } = req.body;
  
    const s3 = new S3Client({accessKeyId: process.env.AWS_S3_RECIPE_COOKING_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_S3_RECIPE_COOKING_SECRET_ACCESS_KEY});
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.RECIPE_COOKING, Key: fullName, ContentType: fileType, Expires: 50});
  
    return res.json({success: true, fullSignature, fullName});
  },

  recipeEquipment: async function(req: Request, res: Response) {
    const fullName =     `${req.session.userInfo!.username}-${uuidv4()}`;
    const { fileType } = req.body;
  
    const s3 = new S3Client({accessKeyId: process.env.AWS_S3_RECIPE_EQUIPMENT_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_S3_RECIPE_EQUIPMENT_SECRET_ACCESS_KEY});
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.RECIPE_EQUIPMENT, Key: fullName, ContentType: fileType, Expires: 50});
  
    return res.json({success: true, fullSignature, fullName});
  },

  recipeIngredients: async function(req: Request, res: Response) {
    const fullName =     `${req.session.userInfo!.username}-${uuidv4()}`;
    const { fileType } = req.body;
  
    const s3 = new S3Client({accessKeyId: process.env.AWS_S3_RECIPE_INGREDIENTS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_S3_RECIPE_INGREDIENTS_SECRET_ACCESS_KEY});
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {Bucket: AWS_S3_BUCKETS.RECIPE_INGREDIENTS, Key: fullName, ContentType: fileType, Expires: 50});
  
    return res.json({success: true, fullSignature, fullName});
  }
};