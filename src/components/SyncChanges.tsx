import React, {FC} from 'react';
import {Fab} from "@material-ui/core";
import {CloudUpload} from "@material-ui/icons";

const SyncChanges: FC = () => {
  return (
    <Fab color='secondary' style={{
      position: "fixed",
      bottom: '2rem',
      right: '2rem',
      zIndex: 9001,
    }} title={'Sync Changes'}>
      <CloudUpload/>
    </Fab>
  );
};

export default SyncChanges;
