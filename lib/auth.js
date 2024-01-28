import { hash } from 'bcryptjs';

// Taking the plan text password and encrypting it
export const hashPassword = async (password) => {
  // hash: 1st argument: plain password; 2nd argument: resolving rounds (higher number = safer but takes longer to resolve): how strong the password is
  //   12 is considered to be safe
  const encryptedPassword = await hash(password, 12);

  return encryptedPassword;
};
