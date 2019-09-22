import * as AWS from 'aws-sdk';
import * as zlib from 'zlib';
import * as stream from 'stream';

export default class FileArchiver {

  s3: AWS.S3;

  constructor(s3: AWS.S3) {
    this.s3 = s3;
  }

  public gzipS3Object(event) {
    const bucket = this.extractBucketNameFromPutObjectEvent(event);
    const key = this.extractKeyNameFromPutObjectEvent(event);
    if (key.endsWith('gz')) {
      console.log("file " + key + "has been gziped.");
      return;
    }
    const readStream = this.getFileReadStream(bucket, key);
    return this.gzipUploadStreamFile(readStream, bucket, key);
  }

  /**
   * S3のPutObjectイベントから バケット名 を抽出する
   * @param event 
   */
  private extractBucketNameFromPutObjectEvent(event) {
    return event.Records[0].s3.bucket.name;
  }

  /**
   * S3のPutObjectイベントから Key を抽出する
   * @param event 
   */
  private extractKeyNameFromPutObjectEvent(event) {
    return decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  }

  /**
   * S3バケットに保存されているファイルをストリーミングする
   */
  private getFileReadStream(bucket, key) {
    const params = { Bucket: bucket, Key: key };
    try {
      return this.s3.getObject(params).createReadStream();
    } catch (err) {
      console.log(err);
    }
  }

  /**
  * ストリームファイルを圧縮し、S3バケットに配置する
  */
  private gzipUploadStreamFile(readStream: stream.Readable, bucket, key) {
    return this.s3.upload({
      Body: readStream.pipe(zlib.createGzip()),
      Bucket: bucket,
      Key: key + '.gz'
    }).promise();
  }

}