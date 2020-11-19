import React, {FC} from 'react';
import LoadingIndicator from "./LoadingIndicator";

const CenteredLoadingScreen: FC = () => {
  return (
    <div style={{display: 'flex', width: '100%', height: '100%'}}>
      <div style={{margin: 'auto'}}>
        <LoadingIndicator/>
      </div>
    </div>
  );
};

export default CenteredLoadingScreen;
