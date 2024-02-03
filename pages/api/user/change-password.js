import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/db';
import { verifyPassword, hashPassword } from '../../../lib/auth';

const handler = async (req, res) => {
  if (req.method !== 'PATCH') return;

  //*   1) Checking if there is an active session
  const session = await getServerSession(req, res, authOptions);

  //*   2) This if statement protects use from unauthorized access
  if (!session) {
    res.status(401).json({ error: 'Unauthorized!' });
    return;
  }

  //   Everything below this is not directly to do with authentication

  //* 4.1)  Getting the user email address
  const userEmail = session.user.email;

  //* 4.2)  Getting passwords from the form
  //   The form has two fields with names: oldPassword and newPassword
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  //* 5.1) Getting the connection
  const client = await connectToDatabase();

  //* 5.2) Getting the user collection from teh DB
  const usersCollection = client.db().collection('users');

  //* 5.3) Getting the user from the DB
  const user = await usersCollection.findOne({ email: userEmail });

  //* 5.4) Checking if there is a user
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    client.close();
    return;
  }

  //* 5.5) assigning user password to a variable
  const currentPassword = user.password;

  //* 5.6) Verifying password from custom function
  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  //* 5.7) Checking if passwords are equal
  if (!passwordsAreEqual) {
    // 403 status code = Authenticated, but NOT authorized
    // Can also use status code 422 i.e. user input is incorrect
    res.status(403).json({ message: 'Invalid password.' });
    client.close();
    return;
  }

  //* 5.8) Encrypting password from custom function
  const hashedPassword = await hashPassword(newPassword);

  //* 6) Updating one document
  //   updateOne: 2nd argument: describing the update
  const result = await usersCollection.updateOne(
    { email: userEmail },
    // Using mongoDB $set, telling it want to set the new password
    // Note: The password field in the DB must already exist. If  it does NOT exist, a new field will be created
    { $set: { password: hashedPassword } }
  );

  //* 7) Returning a response
  client.close();
  res.status(200).json({ message: 'Password updated.' });
};

export default handler;
