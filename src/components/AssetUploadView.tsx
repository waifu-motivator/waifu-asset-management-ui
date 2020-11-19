import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector} from "react-redux";
import {selectMotivationAssetState} from "../reducers";
import MotivationAssetView from "./MotivationAssetView";
import CenteredLoadingScreen from "./CenteredLoadingScreen";

const AssetUploadView: FC = () => {
  const {checkSum} = useParams<{ checkSum: string }>();
  const {motivationAssetsToUpload} = useSelector(selectMotivationAssetState);
  const waifuAsset = motivationAssetsToUpload.find(assetToUpload => assetToUpload.imageChecksum === checkSum);
  return !waifuAsset ?
    (<CenteredLoadingScreen/>) :
    (<MotivationAssetView motivationAsset={waifuAsset}/>)
};

export default AssetUploadView;
