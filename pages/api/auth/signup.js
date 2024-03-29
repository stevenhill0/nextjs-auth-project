import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

//   To get the requested users data, we should set the req, res objects
const handleUserSignup = async (req, res) => {
  // Guard clause to check if request method is NOT POST then just return and no nothing
  // Otherwise run code below the check
  if (req.method !== 'POST') {
    return;
  }

  //* 0.1) Extracting incoming data
  //   So we only proceed once we know we have valid data
  const data = req.body;

  //* 0.2) Pulling the email and password keys. These MUST be what we set in the user's form so do not get any errors
  const { email, password } = data;

  //* 0.3) Doing a check to see if data is valid before continuing inserting a user into the database
  // password trimmed for whitespace
  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    // If any of the have been met i.e. data is invalid, return the below response
    return res
      .status(422)
      .json('Invalid input - password must be at least 7 characters');
  }

  //* 0.4) Function to connect to the database
  const client = await connectToDatabase();

  //* 1) Getting access to the database
  const db = client.db();

  //   Finding One User: seeing if user already exists in the database
  //   undefined if user does not exist in the database, or it is the user object
  const existingUser = await db.collection('users').findOne({ email: email });
  if (existingUser) {
    res.status(422).json('User already exists!');
    // Closing the DB connection
    client.close();
    return;
  }

  //* 2) Getting the encrypted password
  //   hashPassword return a Promise, so MUST use await. If do NOT await, it will return an object ONLY. We do NOT want this
  const hashedPassword = await hashPassword(password);

  //* 3) Creating a new user and store the user (document) in a collection in the database
  //   Can use any collection. If the collection has not be created yet, it will be created
  //   Remember: the password MUST be encrypted
  //    Returns a promise and the result of the operation: give access to the automatically generated user ID
  const result = await db
    .collection('users')
    .insertOne({ email: email, password: hashedPassword });

  //* 4) Sending back a success response
  //   remember to also handle ERRORS which we have NOT done here
  res.status(201).json({ message: 'Create user!' });
  // Closing the DB connection
  client.close();
};

export default handleUserSignup;
