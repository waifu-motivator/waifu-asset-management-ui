import React, {FC, useEffect, useState} from "react";
import {Auth, Hub} from 'aws-amplify';
import Login from "./Login";

export const withAuthenticator = (Component: FC): FC => {
  const Authenticator = () => {
    const [user, setUser] = useState<any>();

    useEffect(() => {
      Hub.listen('auth', ({payload: {event, data}}) => {
        switch (event) {
          case 'signIn':
          case 'cognitoHostedUI':
            getUser().then((userData: any) => setUser(userData));
            break;
          case 'signOut':
            setUser(null);
            break;
          case 'signIn_failure':
          case 'cognitoHostedUI_failure':
            console.log('Sign in failure', data);
            break;
        }
      });
      getUser()
        .then((userData: any) => setUser(userData));
    }, []);

    function getUser(): any {
      return Auth.currentAuthenticatedUser()
        .then(userData => userData)
        .catch(() => console.log('Not signed in'));
    }

    // @ts-ignore
    const login = () => Auth.federatedSignIn({provider: 'Google'});
    return (
      <div>
        {user ? (
          <Component/>
        ) : (
          <Login onLogin={login}/>
        )}
      </div>
    );
  };
  return Authenticator;
}
