import { getSession } from 'next-auth/react';
import UserProfile from '../components/profile/user-profile';

function ProfilePage() {
  return <UserProfile />;
}

// getServerSideProps is a special native function that gets a CONTEXT object, where we get access to the incoming request
// getSession will look into the context object and get the session token cookie and see if it is valid
// getServerSideProps is where you set props for the component, but not limited to that
// can also set the notFound: true (shows the 404 page or set the redirect
const getServerSideProps = async () => {
  const session = await getSession({ req: context });

  // session will be null if NOT authenticated
  // session will be an object if the user is authenticated
  if (!session) {
    // permanent states whether the redirect is permanent or temporary
    return { redirect: { destination: '/', permanent: false } };
  }

  // If there is a session returning the session token
  return {
    props: { session },
  };
};

export default ProfilePage;
