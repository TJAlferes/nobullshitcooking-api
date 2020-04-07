export async function validVerify(
  {
    email,
    confirmationCode
  },
  user
) {
  const emailExists = await user.getUserByEmail(email);

  if (!emailExists.length) {
    return {
      valid: false,
      feedback: 'An issue occurred, please double check your info and try again.'
    };
  }

  const temporaryCode = await user.getTemporaryConfirmationCode(email);

  if (temporaryCode[0].confirmation_code !== confirmationCode) {
    return {
      valid: false,
      feedback: 'An issue occurred, please double check your info and try again.'
    };
  }

  return {valid: true, feedback: 'Valid.'};
}