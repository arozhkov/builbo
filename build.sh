#!/bin/bash

echo "Building"
echo "$@"
echo ""

BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
WORK_DIR=/Users/alexander.rozhkov/work/hackathon/work

DATE=$(date '+%Y%m%d%H%M%S')
# find a better way name builds
BUILD=$DATE

mkdir -p $WORK_DIR/$BUILD
cd $WORK_DIR/$BUILD

echo "BASE_URL=$1" > env.txt
echo "BASE_BRANCH=$2" >> env.txt

if [ "$#" -gt "2" ]; then
echo "HEAD_URL=$3" >> env.txt
echo "HEAD_BRANCH=$4" >> env.txt
fi

# AWS credentials passed via ENV
env | grep "AWS_" >> env.txt

cat env.txt

docker run --rm \
  --env-file ${WORK_DIR}/${BUILD}/env.txt \
  -v ${BIN_DIR}/docker-config.json:/kaniko/.docker/config.json \
  -v ${BIN_DIR}/secrets/github_private:/root/.ssh/id_rsa \
  -v ${BIN_DIR}/start.sh:/kaniko/start.sh \
  arozhkov/builbo:latest 
  
  
#--destination=189141687483.dkr.ecr.us-east-1.amazonaws.com/arozhkov/kaniko:1.0.2 -v info
