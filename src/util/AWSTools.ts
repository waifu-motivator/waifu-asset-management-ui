import {AWSConfig} from "../config/AwsConfig";
import {S3ListObject} from "../types/AssetTypes";

const s3Url = `https://${AWSConfig.Storage.AWSS3.bucket}.s3.amazonaws.com/`

export const buildS3ObjectLink = (s3Item: S3ListObject) => `${s3Url}${s3Item.key}`;
