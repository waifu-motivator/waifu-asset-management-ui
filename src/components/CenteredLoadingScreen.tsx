import React from 'react';
import LoadingIndicator from "./LoadingIndicator";

const CenteredLoadingScreen = () => {
  return (
    <div style={{display: 'flex', width: '100%', height: '100%'}}>
      <div style={{margin: 'auto'}}>
        <LoadingIndicator/>
      </div>
    </div>
  );
};

export default CenteredLoadingScreen;
