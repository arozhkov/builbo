#!/bin/bash

# fake, to rebuild
git init
git config remote.origin.url $BASE_URL
git pull origin $BASE_BRANCH

pwd
ls -la 

/app/bin/jenkinsfile-runner \
    -w "/app/jenkins" \
    -p "/usr/share/jenkins/ref/plugins" \
    -f "/workspace/Jenkinsfile"
