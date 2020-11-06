import './App.css';
import {withAuthenticator} from "@aws-amplify/ui-react";
import React, {useEffect, useState} from 'react';
import Auth from '@aws-amplify/auth'
import {UserProfile} from "../types/User";

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>()
  useEffect(()=>{
    Auth.currentUserInfo().then(userinfo => {
      setUserProfile(userinfo)
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <div style={{display: "flex", flexDirection: 'row'}}>
          <div className={'plugin-chan'}>
            <img width={64} height={64}
                 src="https://avatars3.githubusercontent.com/u/73764618?s=64&v=4"  alt='Plugin-chan'/>
          </div>
          <h3>Waifu Asset Management</h3>
        </div>
        <div style={{flexGrow: 1}} />
        <div style={{margin: 'auto 0'}}>
          {userProfile && (
            <>
              <img
                style={{width: 64, height: 64, borderRadius: '50%'}}
                src={userProfile.attributes.picture}
                alt={userProfile.attributes.given_name} />
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
