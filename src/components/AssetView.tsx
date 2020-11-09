import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector} from "react-redux";
import {selectVisualAssetState} from "../reducers";
import {buildS3ObjectLink} from "../util/AWSTools";
import MotivationAssetView from "./MotivationAssetView";

const AssetView: FC = () => {
  const {etag} = useParams<{ etag: string }>();
  const {s3List} = useSelector(selectVisualAssetState);
  const waifuAsset = s3List.find(s3Object => s3Object.eTag === etag);
  return (<MotivationAssetView assetHref={waifuAsset ? buildS3ObjectLink(waifuAsset) : undefined}/>)
};

export default AssetView;
