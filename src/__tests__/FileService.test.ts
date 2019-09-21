import { FileService } from '../service';
import * as AWS from 'aws-sdk';

let fileService: FileService;
beforeAll(async () => {
    const s3 = new AWS.S3({
        accessKeyId: 'xxx',
        secretAccessKey: 'xxx',
        region: 'us-east-1',
        endpoint: 'http://127.0.0.1:4572',
        s3ForcePathStyle: true
    });
    fileService = new FileService(s3);
    await s3.createBucket({ Bucket: 'my-bucket' }).promise();
});

test('ファイルアップロードしてダウンロードする', async () => {
    const bucketName = 'my-bucket';
    const fileName = 'my-object';
    const body = 'Hello Node.js!!';
    await fileService.upload(bucketName, fileName, body);
    const file = await fileService.getObject(bucketName, fileName);
    expect(file.Body.toString('utf-8')).toBe(body);
});

test('存在しないバケットにファイルアップロードする', async () => {
    const bucketName = 'not-exist-bucket';
    const fileName = 'my-object';
    const body = 'Hello Node.js!!';
    await expect(fileService.upload(bucketName, fileName, body))
        .rejects.toThrow('The specified bucket does not exist');
});
