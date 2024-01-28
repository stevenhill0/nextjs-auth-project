import { hash, compare } from 'bcryptjs';

// Taking the plan text password and encrypting it
export const hashPassword = async (password) => {
  // hash: 1st argument: plain password; 2nd argument: resolving rounds (higher number = safer but takes longer to resolve): how strong the password is
  //   12 is considered to be safe
  const encryptedPassword = await hash(password, 12);

  return encryptedPassword;
};

// Because a newly hashed password will ALWAYS be different, bcryptjs has a COMPARE function to find out if a PLAIN TEXT password MATCHES a HASHED password
export const verifyPassword = async (password, hashedPassword) => {
  // compare will return a BOOLEAN whether the password was true or false
  const isValid = await compare(password, hashedPassword);

  return isValid;
};
