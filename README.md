

## Start
nmp start

## Build Docker image


## Run in container
docker run -p 49160:8080 -d <your username>/node-web-app



## GitHub Events

```
githubPullRequest
    "action": "opened",
    "state": "open",
    "merged": "false"


githubPullRequest
    "action": "updated",
    "state": "open",
    "merged": "false"

githubPullRequest
    "action": "closed",
    "number": "2",
    "state": "closed",
    "title": "Update index.js",
    "url": "https://github.com/arozhkov/demo-app-a/pull/2",
    "merged": "true",


githubComment
    "entityUrl": "https://github.com/arozhkov/demo-app-a/pull/2",
    "action": "created",




githubComment
    "entity": "issue",
    "entityUrl": "https://github.com/arozhkov/demo-app-a/pull/2",
    "action": "edited",
    "comment": {
      "type": "com.symphony.integration.github.repository",
      "version": "1.0",
      "body": "/LGTM DADA",
      "url": "https://github.com/arozhkov/demo-app-a/pull/2#issuecomment-446673715"
    },
```
## Notes

```
./build.sh git@github.com:arozhkov/demo-app-a.git master git@github.com:arozhkov/demo-app-a.git arozhkov-patch-4

git init
git config remote.origin.url git@github.com:arozhkov/demo-app-a.git
git fetch --no-tags --progress git@github.com:arozhkov/demo-app-a.git master arozhkov-patch-4



/kaniko/executor --destination=189141687483.dkr.ecr.us-east-1.amazonaws.com/arozhkov/demo-app-a:1.0.5 -v info
```