import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {selectMotivationAssetState} from "../reducers";
import MotivationAssetView from "./MotivationAssetView";
import {createViewedExistingAssetEvent} from "../events/MotivationAssetEvents";

const MotivationAssetEditView: FC = () => {
  const {etag} = useParams<{ etag: string }>();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createViewedExistingAssetEvent(etag))
  }, [etag]);

  const {currentViewedAsset} = useSelector(selectMotivationAssetState);
  return <MotivationAssetView motivationAsset={currentViewedAsset}
  />
};

export default MotivationAssetEditView;
