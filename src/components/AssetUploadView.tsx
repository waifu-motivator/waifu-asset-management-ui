import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {selectMotivationAssetState} from "../reducers";
import MotivationAssetView from "./MotivationAssetView";
import CenteredLoadingScreen from "./CenteredLoadingScreen";
import {createViewedLocalAssetEvent} from "../events/MotivationAssetEvents";

const AssetUploadView: FC = () => {
  const {checkSum} = useParams<{ checkSum: string }>();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createViewedLocalAssetEvent(checkSum))
  }, [checkSum]);

  const {currentViewedAsset} = useSelector(selectMotivationAssetState);
  return !currentViewedAsset ?
    ((<CenteredLoadingScreen/>)) :
    (<MotivationAssetView motivationAsset={currentViewedAsset}/>)

};

export default AssetUploadView;
