import React, {FC, useEffect, useState} from "react";
import {Auth, Hub} from 'aws-amplify';
import Login from "./Login";

export const withAuthenticator = (Component: FC): FC => {
  const Authenticator = () => {
    const [user, setUser] = useState<any>(undefined);
    const getUser = (): any => Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => null);

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

    // @ts-ignore
    const login = () => Auth.federatedSignIn({provider: 'Google'});
    return (
      <div>
        {user ? (
          <Component/>
        ) : (
          <Login onLogin={login}
                 loading={user === undefined}/>
        )}
      </div>
    );
  };
  return Authenticator;
}
