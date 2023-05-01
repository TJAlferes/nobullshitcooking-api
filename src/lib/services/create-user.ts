export async function createUserService({
  email,
  password,
  username,
  userRepo
}) {
  await validRegister({email, password, username}, userRepo);

  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  const confirmationCode = uuidv4();

  const user = constructUser({
    email,
    password: encryptedPassword,
    username,
    confirmationCode
  });
    
  await userRepo.create(user);

  // emailService ?
  emailConfirmationCode(email, confirmationCode);
}
