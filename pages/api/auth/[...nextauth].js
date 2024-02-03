import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export const authOptions = {
  // To make sure a JSON WEB TOKEN is CREATED we use the sessions option
  //   session is an object were we configure how a session for an authenticated user is MANAGED
  session: {
    // The JSON web token key should be set to TRUE, so that json web tokens are being used
    jwt: true,
  },
  // providers option
  providers: [
    // The provider option gives a list of the various providers we can choose from e.g. Apple
    // We are using credentials option which means we are manually setting it using local email and password
    // Credentials takes a configuration object itself
    CredentialsProvider({
      // Credentials lets NextAuth to setup a log in form for us, IF NEEDED. Do NOT need it have own form
      // Credentials:{}

      // Authorize is a function which NextJS will call for us when it RECEIVES an incoming LOGIN request
      //   Authorize returns a Promise
      //   Authorize takes one Argument: credentials that was submitted i.e. the EMAIL and PASSWORD that was submitted via the FORM
      async authorize(credentials) {
        // IN here we have to bring our own authorization logic: check if credentials are valid and tell user if the the credentials was invalid i.e. throw an error
        //* 1) Connect to database
        const client = await connectToDatabase();
        //

        //* 2) Check if there IS a user in the database
        // Accessing the users collection
        const usersCollection = await client.db().collection('users');

        // Finding the user where email in the DB is EQUAL to the email sent via the FORM
        // This makes sens because we will setup to EXPECT the email input value from the CLIENT side FORM
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        // When throwing an error NextAuth will REJECT the Promise it generates and by DEFAULT wil REDIRECT the client to another page.
        // We can overwrite redirecting to rather stay on the page
        if (!user) {
          client.close();
          throw new Error('No user found!');
        }

        // * 3) Check if PASSWORD is correct
        //  Keep in mind we HASH the password when creating a user, so cannot just compare the form password with the stored password. We MUST first ENCRYPT the form password to see if it is EQUAL to hte password in the database
        //  Because a newly hashed password will ALWAYS be different, bcryptjs has a COMPARE function to find out if a PLAIN TEXT password MATCHES a HASHED password
        // Note: we can NOT DECRYPT a HASHED/ENCRYPTED password, why must hash the incoming form password

        // credentials.password = the plain text password from the client side FORM
        // user.password  the password from the USER OBJECT in the database
        // awaiting because verifyPassword is an async function and return a Promise object
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        // Check in case credentials were invalid
        if (!isValid) {
          client.close();
          throw new Error('Could not log you in!');
        }

        // Shutting down the client
        client.close();

        // * 4) Returning object to show authorization succeeded
        // If we return an object inside the authorize function, we need NextAuth know that AUTHORIZATION SUCCEEDED
        // The object will be ENCODED inside the JSON web token
        // NOTE: we should not PASS the ENTIRE user OBJECT because we do NOT want to include the password
        // WE pulling the email from the user object in the database
        return { email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

// NextAuth is a function which we can CALL
// When called it returns a HANDLER function. It needs to because this is still an API route. An API D route needs to export a function
// When calling NExtAuth we pass a CONFIGURATION object
export default NextAuth(authOptions);
