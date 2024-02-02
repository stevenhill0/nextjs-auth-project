import { useEffect } from 'react';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import { useState } from 'react';
import { getSession } from 'next-auth/react';

function UserProfile() {
  // // Managing loading state
  // const [isLoading, setIsLoading] = useState(true);

  // // Get the session when the component is rendered
  // // Using useEffect because we getSession is ASYNCHRONOUS
  // useEffect(() => {
  //   // getSession returns a promise
  //   // Cos its a promise we can use either .then or async await.
  //   // If we use async await we HAVE to WRAP it in another function: because we can NOT make the useEffect MAIN function ASYNC
  //   // Note: then((session) => session) is NULL if we do NOT have a session/user is not logged in, OR it is will be an OBJECT if logged in
  //   getSession().then((session) => {
  //     if (!session) {
  //       // If session is not truthy navigate away
  //       //   window.location.href changes the URL in teh browser
  //       window.location.href = '/auth';
  //     } else {
  //       // If we do have a session setting isLoading to false
  //       setIsLoading(false);
  //     }
  //   });
  // });

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  // Changing the password via the http request
  const handleChangePassword = async (passwordData) => {
    // We expect to get a PATCH request: see change-password.js
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    console.log(data);
  };

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={handleChangePassword} />
    </section>
  );
}

export default UserProfile;
