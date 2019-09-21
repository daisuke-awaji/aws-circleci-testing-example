import * as AWS from 'aws-sdk';

export class FileService {
    s3: AWS.S3;

    constructor(s3: AWS.S3) {
        this.s3 = s3 ? s3 : new AWS.S3();
    }

    public upload = async (bucketName: string, fileName: string, body: AWS.S3.Body) => {
        return await this.s3.putObject({ Bucket: bucketName, Key: fileName, Body: body }).promise();
    }

    public getObject = async (bucketName: string, fileName: string) => {
        return await this.s3.getObject({ Bucket: bucketName, Key: fileName }).promise();
    }

    public createBucket = async (bucketName: string) => {
        return await this.s3.createBucket({ Bucket: bucketName }).promise();
    }
}