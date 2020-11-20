import React, {FC, useMemo} from 'react';
import {Fab, useTheme, Zoom} from "@material-ui/core";
import {CloudUpload} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {requestSyncChanges} from "../events/ApplicationLifecycleEvents";
import {selectMotivationAssetState} from "../reducers";
import {isEmpty} from 'lodash';
import LoadingIndicator from "./LoadingIndicator";

const SyncChanges: FC = () => {
  const dispatch = useDispatch();
  const syncChanges = () => {
    dispatch(requestSyncChanges());
  };
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const {unsyncedAssets, syncingAssets} = useSelector(selectMotivationAssetState)
  const needsSync = useMemo(() => !isEmpty(unsyncedAssets), [unsyncedAssets]);
  const loading = useMemo(() => !isEmpty(syncingAssets), [syncingAssets]);

  return (
    <>
      {loading && <LoadingIndicator overlay/>}
      <Zoom in={needsSync}
            timeout={transitionDuration}
            unmountOnExit
      >
        <Fab color='secondary' style={{
          position: "fixed",
          bottom: '2rem',
          right: '2rem',
          zIndex: 90001,
        }} title={'Sync Changes'} onClick={syncChanges}>
          <CloudUpload/>
        </Fab>
      </Zoom>
    </>
  );
};

export default SyncChanges;
