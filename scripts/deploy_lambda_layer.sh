#!/bin/bash

ENV=$1

# 事前に LambdaLayer ソースファイル保存用のS3バケットを作成しておく
aws cloudformation deploy --stack-name ${ENV}-lambda-layer-bucket \
           --template-file lambda_layer_bucket.template.yaml \
           --capabilities CAPABILITY_IAM \
           --parameter-overrides Env=${ENV}

aws s3 cp lambda_layer.zip s3://${ENV}-lambda-layer-upload-bucket-nodejs10

