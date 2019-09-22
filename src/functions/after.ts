import * as AWS from 'aws-sdk';
import FileArchiver from '../main/after';
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const handler = (event: any, context: any) => {
  new FileArchiver(s3).gzipS3Object(event);
};

export { handler };