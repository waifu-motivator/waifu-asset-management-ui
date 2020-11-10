import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector} from "react-redux";
import {selectMotivationAssetState} from "../reducers";
import MotivationAssetView from "./MotivationAssetView";
import {MotivationAsset} from "../reducers/MotivationAssetReducer";

const AssetUploadView: FC = () => {
  const {checkSum} = useParams<{ checkSum: string }>();
  const {motivationAssetsToUpload} = useSelector(selectMotivationAssetState);
  const waifuAsset = motivationAssetsToUpload.find(assetToUpload => assetToUpload.checkSum === checkSum);
  const motivationAsset = waifuAsset ? {
    imageHref: waifuAsset.btoa,
    visuals: {
      imageAlt: '',
      path: 'bleh',
      imageDimensions: {
        width: 69,
        height: 420,
      },
      categories: [],
      characters: [],
    }
  } as MotivationAsset : undefined;
  return (<MotivationAssetView motivationAsset={motivationAsset}/>)
};

export default AssetUploadView;
