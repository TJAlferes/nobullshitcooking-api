require('dotenv').config();
import S3 from 'aws-sdk/clients/s3';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';  // do in React instead?

import { getSignedUrlPromise } from '../../lib/utils/getSignedUrlPromise';

const AWS_S3_AVATAR_BUCKET: string = process.env.AWS_S3_AVATAR_BUCKET!;
const AWS_S3_CONTENT_BUCKET: string = process.env.AWS_S3_CONTENT_BUCKET!;
const AWS_S3_EQUIPMENT_BUCKET: string = process.env.AWS_S3_EQUIPMENT_BUCKET!;
const AWS_S3_INGREDIENT_BUCKET: string = process.env.AWS_S3_INGREDIENT_BUCKET!;
const AWS_S3_RECIPE_BUCKET: string = process.env.AWS_S3_RECIPE_BUCKET!;
const AWS_S3_RECIPE_COOKING_BUCKET: string =
  process.env.AWS_S3_RECIPE_COOKING_BUCKET!;
const AWS_S3_RECIPE_EQUIPMENT_BUCKET: string =
  process.env.AWS_S3_RECIPE_EQUIPMENT_BUCKET!;
const AWS_S3_RECIPE_INGREDIENTS_BUCKET: string =
  process.env.AWS_S3_RECIPE_INGREDIENTS_BUCKET!;

export const getSignedUrl = {
  avatar: async function(req: Request, res: Response) {
    const fullName = `${req.session!.userInfo.username}`;
    const tinyName = `${fullName}-tiny`;
    const fileType = req.body.fileType;

    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_AVATAR_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_AVATAR_SECRET_ACCESS_KEY
    });

    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_AVATAR_BUCKET,
      Key: fullName,
      ContentType: fileType,
      Expires: 50
    });

    const tinySignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_AVATAR_BUCKET,
      Key: tinyName,
      ContentType: fileType,
      Expires: 50
    });

    return res.json({success: true, fullSignature, tinySignature, fullName});
  },
  content: async function(req: Request, res: Response) {
    const fullName = `${req.session!.userInfo.username}-${uuidv4()}`;
    const thumbName = `${fullName}-thumb`;
    const fileType = req.body.fileType;
  
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_CONTENT_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_CONTENT_SECRET_ACCESS_KEY
    });
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_CONTENT_BUCKET,
      Key: fullName,
      ContentType: fileType,
      Expires: 50
    });
  
    const thumbSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_CONTENT_BUCKET,
      Key: thumbName,
      ContentType: fileType,
      Expires: 50
    });
  
    return res.json({success: true, fullSignature, thumbSignature, fullName});
  },
  equipment: async function(req: Request, res: Response) {
    const fullName = `${req.session!.userInfo.username}-${uuidv4()}`;
    const tinyName = `${fullName}-tiny`;
    const fileType = req.body.fileType;
  
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_EQUIPMENT_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_EQUIPMENT_SECRET_ACCESS_KEY
    });
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_EQUIPMENT_BUCKET,
      Key: fullName,
      ContentType: fileType,
      Expires: 50
    });
  
    const tinySignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_EQUIPMENT_BUCKET,
      Key: tinyName,
      ContentType: fileType,
      Expires: 50
    });
  
    return res.json({success: true, fullSignature, tinySignature, fullName});
  },
  ingredient: async function(req: Request, res: Response) {
    const fullName = `${req.session!.userInfo.username}-${uuidv4()}`;
    const tinyName = `${fullName}-tiny`;
    const fileType = req.body.fileType;
  
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_INGREDIENT_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_INGREDIENT_SECRET_ACCESS_KEY
    });
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_INGREDIENT_BUCKET,
      Key: fullName,
      ContentType: fileType,
      Expires: 50
    });
  
    const tinySignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_INGREDIENT_BUCKET,
      Key: tinyName,
      ContentType: fileType,
      Expires: 50
    });
  
    return res.json({success: true, fullSignature, tinySignature, fullName});
  },
  recipe: async function(req: Request, res: Response) {
    const fullName = `${req.session!.userInfo.username}-${uuidv4()}`;
    const thumbName = `${fullName}-thumb`;
    const tinyName = `${fullName}-tiny`;
    const fileType = req.body.fileType;
  
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_RECIPE_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_RECIPE_SECRET_ACCESS_KEY
    });
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_RECIPE_BUCKET,
      Key: fullName,
      ContentType: fileType,
      Expires: 50
    });
  
    const thumbSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_RECIPE_BUCKET,
      Key: thumbName,
      ContentType: fileType,
      Expires: 50
    });
  
    const tinySignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_RECIPE_BUCKET,
      Key: tinyName,
      ContentType: fileType,
      Expires: 50
    });
  
    return res.json({
      success: true,
      fullSignature,
      thumbSignature,
      tinySignature,
      fullName
    });
  },
  recipeCooking: async function(req: Request, res: Response) {
    const fullName = `${req.session!.userInfo.username}-${uuidv4()}`;
    const fileType = req.body.fileType;
  
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_RECIPE_COOKING_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_RECIPE_COOKING_SECRET_ACCESS_KEY
    });
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_RECIPE_COOKING_BUCKET,
      Key: fullName,
      ContentType: fileType,
      Expires: 50
    });
  
    return res.json({success: true, fullSignature, fullName});
  },
  recipeEquipment: async function(req: Request, res: Response) {
    const fullName = `${req.session!.userInfo.username}-${uuidv4()}`;
    const fileType = req.body.fileType;
  
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_RECIPE_EQUIPMENT_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_RECIPE_EQUIPMENT_SECRET_ACCESS_KEY
    });
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_RECIPE_EQUIPMENT_BUCKET,
      Key: fullName,
      ContentType: fileType,
      Expires: 50
    });
  
    return res.json({success: true, fullSignature, fullName});
  },
  recipeIngredients: async function(req: Request, res: Response) {
    const fullName = `${req.session!.userInfo.username}-${uuidv4()}`;
    const fileType = req.body.fileType;
  
    const s3 = new S3({
      accessKeyId: process.env.AWS_S3_RECIPE_INGREDIENTS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_RECIPE_INGREDIENTS_SECRET_ACCESS_KEY
    });
  
    const fullSignature = await getSignedUrlPromise(s3, 'putObject', {
      Bucket: AWS_S3_RECIPE_INGREDIENTS_BUCKET,
      Key: fullName,
      ContentType: fileType,
      Expires: 50
    });
  
    return res.json({success: true, fullSignature, fullName});
  }
};