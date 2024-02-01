import { useRef, useState } from 'react';
import classes from './auth-form.module.css';
// Call the signIn function to send a sign in request
// The request is called automatically
import { signIn } from 'next-auth/react'; // module path CHANGED after NextAuth version 14+ i.e. 'next-auth/react'
import { useRouter } from 'next/router';

// Best practice to create this function i another file
const createUser = async (email, password) => {
  const response = await fetch('api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  //  response returns a promise
  const data = await response.json();

  // Check if the response is NOT Okay
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong! Please try again.');
  }

  return data;
};

function AuthForm() {
  const router = useRouter();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  // Because createUser returns a promise, we can also use async await here to await the result from the createUser function
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Getting the input form values form the refs via useRef
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: add validation

    if (isLogin) {
      //SignIn 1st argument describes the Provider for which we want to sign in with e.g. Apple. We using the local credentials provider
      // SignIn 2nd argument: configuration object
      // redirect = false because by default NextAuth redirects to another page. Normally if there is an ERROR we would want to stay on the page and then SHOW the error to the user
      // When setting redirect to false signIn returns a Promise which yields a result: if we had an error, result will contain data about the error. If not error result will still contain an object, but WITHOUT ERROR DATA

      // NB NOTE 1.1: The 2nd argument i.e. the configure object is what is PASSED to the credentials parameter in the authorize function ([...nextauth].js file)
      // NB NOTE 1.2: And because we are passing the EMAIL and the PASSWORD from the FORM we MUST set them here
      const result = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });

      // If not error during authorization
      if (!result.error) {
        // Best NOT to use window.location.href to redirect because it RESETS the application
        // window.location.href is fine for an initial page load. But if we have already worked in the app we do NOT want to reset the app lose ALL out STATE
        // Rather use the useRouter hook from 'next/router'
        router.replace('/profile'); // replace will redirect us by replacing hte URL with a different one
      }
    } else {
      try {
        const result = await createUser(enteredEmail, enteredPassword);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      {/* Connecting the submit handler to the form */}
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
