import FileService from './service/FileService';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: 'xxx',
    secretAccessKey: 'xxx',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:4572',
    s3ForcePathStyle: true
});

const main = async () => {
    const bucketName = 'geeawa';
    const fileName = 'my-object';
    const body = 'Hello Node.js!!';

    const fileService = new FileService(s3);
    await fileService.upload(bucketName, fileName, body);

    const file = await fileService.getObject(bucketName, fileName);
    console.log(file.Body.toString('utf-8'));
}

main();