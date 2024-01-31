'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import classes from './main-navigation.module.css';

function MainNavigation() {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    // signOut returns a promise, but we do NOT care because we are using useSession the COMPONENT will be UPDATED anyway, as soon as the ACTIVE session CHANGES. And it will change when we sign out
    // NextJS will CLEAR the COOKIE and CLEAR OUT the info that the active user is logged out
    // When logged out NextJS will REMOVE the session COOKIE from the browser
    signOut();
  };

  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>
          {!session && !status && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}

          {session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;

// Showing profile ONLY if the user is authenticated/logged in i.e has a save session

// Will show flashing. Optimizing UX in another video
