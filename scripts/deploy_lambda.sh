#!/bin/bash

ENV=$1

aws cloudformation package --template-file lambda.template.yaml \
            --output-template-file packaged.yaml \
            --s3-bucket sam-template-packaged

aws cloudformation deploy --stack-name ${ENV}-thumbnailFunctionStack \
           --template-file packaged.yaml \
           --capabilities CAPABILITY_IAM \
           --parameter-overrides Env=${ENV}
