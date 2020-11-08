import React, {FC} from 'react';
import { useParams } from 'react-router-dom';
import {useSelector} from "react-redux";
import {selectVisualAssetState} from "../reducers";
import {buildS3ObjectLink} from "../util/AWSTools";

const AssetView: FC = () => {
  const {etag} = useParams<{etag: string}>();
  const {s3List} = useSelector(selectVisualAssetState);
  const waifuAsset = s3List.find(s3Object => s3Object.eTag === etag);
  return !waifuAsset ? (<span>Not-Found</span>) : (
    <div>
      <div>
        <img src={buildS3ObjectLink(waifuAsset)} alt={waifuAsset.key}/>
      </div>
    </div>
  );
};

export default AssetView;
