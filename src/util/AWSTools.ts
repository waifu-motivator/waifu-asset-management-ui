import {AWSConfig} from "../config/AwsConfig";

const s3Url = `https://${AWSConfig.Storage.AWSS3.bucket}.s3.amazonaws.com/`

export const buildS3ObjectLink = (s3Key: string): string => `${s3Url}${s3Key}`;
