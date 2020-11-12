import React, {FC} from 'react';
import {Fab, useTheme, Zoom} from "@material-ui/core";
import {CloudUpload} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {createSyncChangesEvent} from "../events/ApplicationLifecycleEvents";

const SyncChanges: FC = () => {
  const dispatch = useDispatch();
  const syncChanges = () => {
    dispatch(createSyncChangesEvent());
  };
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  return (
    <Zoom in={true}
          timeout={transitionDuration}
          unmountOnExit
    >
      <Fab color='secondary' style={{
        position: "fixed",
        bottom: '2rem',
        right: '2rem',
        zIndex: 9001,
      }} title={'Sync Changes'} onClick={syncChanges}>
        <CloudUpload/>
      </Fab>
    </Zoom>
  );
};

export default SyncChanges;
