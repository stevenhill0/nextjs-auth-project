import { useState, useEffect } from 'react';
import AuthForm from '../components/auth/auth-form';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';

function AuthPage() {
  // We don't need the workaround anymore
  // const [isLoading, setIsLoading] = useState(true);

  // const router = useRouter();

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (session) {
  //       router.replace('/profile');
  //     }
  //     setIsLoading(false);
  //   });
  // }, [router]);

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    router.replace('/');
  }

  if (status === 'loading') {
    return <p className="center">Loading...</p>;
  }

  return <AuthForm />;
}

export default AuthPage;
