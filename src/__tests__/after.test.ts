import * as AWS from 'aws-sdk';
import FileArchiver from '../main/after';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';

let s3: S3;
beforeAll(async () => {
    s3 = new AWS.S3({
        accessKeyId: 'xxx',
        secretAccessKey: 'xxx',
        region: 'ap-northeast-1',
        endpoint: 'http://127.0.0.1:4572',
        s3ForcePathStyle: true
    });

    await clearAllS3Buckets();
});

const clearAllS3Buckets = async () => {
    const listBuckets = await s3.listBuckets().promise();
    for (const bucket of listBuckets.Buckets) {
        const listObject = await s3.listObjects({ Bucket: bucket.Name }).promise();
        await Promise.all(
            listObject.Contents.map(
                (content) => {
                    console.log(content);
                    return s3.deleteObject({ Bucket: bucket.Name, Key: content.Key }).promise();
                }
            )
        );
        await s3.deleteBucket({ Bucket: bucket.Name }).promise();
    }
}

test('S3にアップロードされているファイルを取得し、圧縮して再配置する', async () => {
    const bucketName = 'example-bucket';
    await s3.createBucket({ Bucket: bucketName }).promise();
    await s3.putObject({
        Bucket: 'example-bucket', Key: '1mb.mov',
        Body: fs.readFileSync('src/__tests__/files/1mb.mov')
    }).promise();

    const event = JSON.parse(fs.readFileSync('src/__tests__/events/s3put.event.json', 'utf8'));
    await new FileArchiver(s3).gzipS3Object(event);

    const listObjects = await s3.listObjects({ Bucket: bucketName }).promise();
    expect(listObjects.Contents).toHaveLength(2);

    const source = await s3.getObject({ Bucket: bucketName, Key: '1mb.mov' }).promise();
    const gziped = await s3.getObject({ Bucket: bucketName, Key: '1mb.mov.gz' }).promise();
    expect(gziped.ContentLength).toBeLessThan(source.ContentLength);
});
