import {AWSConfig} from "../config/AwsConfig";
import {S3ListObject} from "../types/AssetTypes";

const s3Url = `https://${AWSConfig.Storage.AWSS3.bucket}.s3.amazonaws.com/`

export const buildS3ObjectLink = (s3Key: string): string => `${s3Url}${s3Key}`;
