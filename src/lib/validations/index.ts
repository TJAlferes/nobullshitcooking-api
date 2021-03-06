import bcrypt from 'bcrypt';
import {
  array,
  defaulted,
  number,
  object,
  optional,
  string
} from 'superstruct';

import { IStaff, IUser } from '../../access/mysql';

export const validCreatingContent = object({
  contentTypeId: number(),
  authorId: number(),
  ownerId: number(),
  created: string(),
  published: defaulted(string(), null),
  title: string(),
  items: string()
});

export const validUpdatingContent = object({
  contentTypeId: number(),
  ownerId: number(),
  published: defaulted(string(), null),
  title: string(),
  items: string()
});

export const validEquipment = object({
  equipmentTypeId: number(),
  authorId: number(),
  ownerId: number(),
  name: string(),
  description: string(),
  image: defaulted(string(), '')
});

export const validFavoriteRecipe =
  object({userId: number(), recipeId: number()});

export const validFriendship = object({
  userId: number(),
  friendId: number(),
  status1: string(),
  status2: string()
});

export const validIngredient = object({
  ingredientTypeId: number(),
  authorId: number(),
  ownerId: number(),
  brand: defaulted(string(), ''),
  variety: defaulted(string(), ''),
  name: string(),
  altNames: optional(array(string())),
  description: string(),
  image: defaulted(string(), '')
});

export const validPlan = object({
  authorId: number(),
  ownerId: number(),
  name: string(),
  data: defaulted(
    string(),
    JSON.stringify({
       1: [],  2: [],  3: [],  4: [],  5: [],  6: [],  7: [],
       8: [],  9: [], 10: [], 11: [], 12: [], 13: [], 14: [],
      15: [], 16: [], 17: [], 18: [], 19: [], 20: [], 21: [],
      22: [], 23: [], 24: [], 25: [], 26: [], 27: [], 28: []
    })
  )
});

export const validProduct = object({
  product_category_id: string(),
  product_type_id: string(),
  brand: defaulted(string(), ''),
  variety: defaulted(string(), ''),
  name: string(),
  alt_names: optional(array(string())),
  description: string(),
  //specs:
  image: defaulted(string(), '')
});

export const validRecipe = object({
  recipe_type_id: number(),
  cuisineId: number(),
  authorId: number(),
  ownerId: number(),
  title: string(),
  description: string(),
  activeTime: string(),
  totalTime: string(),
  directions: string(),
  recipeImage: defaulted(string(), ''),
  equipmentImage: defaulted(string(), ''),
  ingredientsImage: defaulted(string(), ''),
  cookingImage: defaulted(string(), ''),
  video: defaulted(string(), '')
});

export const validRecipeEquipment =
  object({recipeId: number(), equipmentId: number(), amount: number()});

export const validRecipeIngredient = object({
  recipeId: number(),
  ingredientId: number(),
  amount: number(),
  measurementId: number()
});

export const validRecipeMethod =
  object({recipeId: number(), methodId: number()});

export const validRecipeSubrecipe = object({
  recipeId: number(),
  subrecipeId: number(),
  amount: number(),
  measurementId: number()
});

export const validSavedRecipe = object({userId: number(), recipeId: number()});

export const validSupplier = object({name: string()});

export const validStaffRegisterRequest =
  object({email: string(), pass: string(), staffname: string()});

export const validUserRegisterRequest =
  object({email: string(), pass: string(), username: string()});

export async function validRegister(
  {email, pass, name}: Register,
  access: IStaff | IUser
) {
  // Problem: This would invalidate some older/alternative email types. Remove?
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return "Invalid email.";
  }
  if (name.length < 6) return "Name must be at least 6 characters.";
  if (name.length > 20) return "Name must be no more than 20 characters.";
  if (pass.length < 6) return "Password must be at least 6 characters.";
  if (pass.length > 54) return "Password must be no more than 54 characters.";

  const nameExists = await access.getByName(name);
  if (nameExists) return "Name already taken.";

  const emailExists = await access.getByEmail(email);
  if (emailExists) return "Email already in use.";

  return "valid";
}

export const validResendRequest = object({email: string(), pass: string()});

export async function validResend(
  {email, pass}: Resend,
  access: IStaff | IUser
) {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return "Invalid email.";
  }
  if (pass.length < 6) return "Invalid password.";
  if (pass.length > 54) return "Invalid password.";

  const exists = await access.getByEmail(email);
  //crypto.timingSafeEqual(exists.email, email) ???
  if (!exists) return "Incorrect email or password.";

  const correctPassword = await bcrypt.compare(pass, exists.pass);
  if (!correctPassword) return "Incorrect email or password.";

  const confirmed = exists.confirmation_code === null;
  if (confirmed) return "Already verified.";

  return "valid";
}

export const validVerifyRequest =
  object({email: string(), pass: string(), confirmationCode: string()});

export async function validVerify(
  {email, pass, confirmationCode}: Verify,
  access: IStaff | IUser
) {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return "Invalid email.";
  }
  if (pass.length < 6) return "Invalid password.";
  if (pass.length > 54) return "Invalid password.";

  const exists = await access.getByEmail(email);
  if (!exists) {
    return "An issue occurred, please double check your info and try again.";
  }

  const correctPassword = await bcrypt.compare(pass, exists.pass);
  if (!correctPassword) return "Incorrect email or password.";
  
  if (exists.confirmation_code !== confirmationCode) {
    return "An issue occurred, please double check your info and try again.";
  }

  return "valid";
}

export const validCreatingStaff = object({
  email: string(),
  encryptedPass: string(),
  staffname: string(),
  confirmationCode: defaulted(string(), null)
});

export const validCreatingUser = object({
  email: string(),
  encryptedPass: string(),
  username: string(),
  confirmationCode: defaulted(string(), null)
});

export const validUpdatingStaff =
  object({email: string(), pass: string(), staffname: string()});

export const validUpdatingUser =
  object({email: string(), pass: string(), username: string()});

export const validLoginRequest = object({email: string(), pass: string()});

export async function validLogin(
  {email, pass}: Login,
  access: IStaff | IUser
) {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return {feedback: "Invalid email."};
  }
  if (pass.length < 6) return {feedback: "Invalid password."};
  if (pass.length > 54) return {feedback: "Invalid password."};

  const exists = await access.getByEmail(email);
  //crypto.timingSafeEqual() ???
  if (!exists) return {feedback: "Incorrect email or password."};
  
  const correctPassword = await bcrypt.compare(pass, exists.pass);
  if (!correctPassword) return {feedback: "Incorrect email or password."};

  const confirmed = exists.confirmation_code === null;
  if (!confirmed) {
    return {feedback: "Please check your email for your confirmation code."};
  }

  return {feedback: "valid", exists};
}

type Login = {
  email: string;
  pass: string;
};

type Register = Login & {
  name: string;
};

type Resend = Login;

type Verify = Login & {
  confirmationCode: string;
};