import * as AWS from 'aws-sdk';

export default function awsConfigureForLocalStack() {
    AWS.config.update({
        accessKeyId: 'xxxxxxxxxxxxx',
        secretAccessKey: 'xxxxxxxxxxxxx',
        s3ForcePathStyle: true,
        s3: {
            region: 'us-east-1',
            endpoint: 'http://127.0.0.1:4572'
        },
        sns: {
            region: 'us-east-1',
            endpoint: 'http://localhost:4575'
        }
    });
}
