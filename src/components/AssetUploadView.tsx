import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector} from "react-redux";
import {selectMotivationAssetState} from "../reducers";
import MotivationAssetView from "./MotivationAssetView";

const AssetUploadView: FC = () => {
  const {checkSum} = useParams<{ checkSum: string }>();
  const {motivationAssetsToUpload} = useSelector(selectMotivationAssetState);
  const waifuAsset = motivationAssetsToUpload.find(assetToUpload => assetToUpload.checkSum === checkSum);
  return (<MotivationAssetView assetHref={waifuAsset ? waifuAsset.btoa : undefined}/>)
};

export default AssetUploadView;
