'use strict';
console.log('Loading function');

import * as AWS from 'aws-sdk';
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const dynamodb = new AWS.DynamoDB();

const handler = (event: any, context: any) => {
  console.log(event);
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const params = {
    Bucket: bucket,
    Key: key,
  };
  console.log(bucket, key);
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
      const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
      console.log(message);
      return message
    } else {
      console.log(data);
      var contentType = data.ContentType;
      var extension = contentType.split('/').pop();
      if (extension === 'jpg') {
        var params = {
          Item: {
            "filepath": {
              S: key
            }
          },
          ReturnConsumedCapacity: "TOTAL",
          TableName: "table"
        };
        dynamodb.putItem(params, (err, data) => {
          if (err) console.log(err, err.stack);
          else console.log(data);
        });
      }
    }
  })
};

export { handler };