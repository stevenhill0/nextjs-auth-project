// MongoClient helps to establish a connection
import { MongoClient } from 'mongodb/lib/mongo_client';

// The connection returns a Promise why we should use async await: we get back the connected client
export const connectToDatabase = async () => {
  const client = await MongoClient.connect(
    'mongodb+srv://steven:TwDlF7Jdo1voof9H@auth-cluster.ykphwww.mongodb.net/auth-demo'
  );

  return client;
};
