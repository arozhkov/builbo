
const Symphony = require('symphony-api-client-node');
const { exec } = require('child_process');
const URL = require('url').URL;

function sshUrl(str) {
  // "git_url": "git://github.com/arozhkov/demo-app-a.git",
  // "ssh_url": "git@github.com:arozhkov/demo-app-a.git",
  const httpUrl = new URL(str);
  return 'git@' + httpUrl.host + ':' + httpUrl.pathname.substr(1) + '.git'
}

// this function must schedule ECS Task 
// and publish link to CloudWatch
// now it's just running local bash script
const build = (baseUrl, baseBranch, headUrl, headBranch) => {

  command = './build.sh ' + baseUrl + ' ' + baseBranch
  if (headUrl && headBranch) {
    command = command + ' ' + headUrl + ' ' + headBranch
  }

  // lame thing, just don't have time to make it better
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

const buildHead = (streamId, data) => {
  answer = 'Building <b>PR</b> ' + data.githubPullRequest.url;
  Symphony.sendMessage(streamId, answer, null, Symphony.MESSAGEML_FORMAT);
  build(data.githubPullRequest.repoHead.url, data.githubPullRequest.repoHead.branch)
}

const buildBase = (streamId, data) => {
  answer = 'PR ' + data.githubPullRequest.url + ' merged, building base branch';
  Symphony.sendMessage(streamId, answer, null, Symphony.MESSAGEML_FORMAT);
  build(data.githubPullRequest.repoBase.url, data.githubPullRequest.repoBase.branch)
}

const processPullRequestEvent = (streamId, data) => {
  if ( data.githubPullRequest.action === 'opened' || data.githubPullRequest.action === 'updated') {
    buildHead(streamId, data)
  } 
  if ( data.githubPullRequest.action === 'closed' && data.githubPullRequest.merged === 'true' ) {
    buildBase(streamId, data)
  }
}

const processCommentEvent = (streamId, data) => {
  if ( data.githubComment.action === 'created' ) {

    answer = 'Processing <b>Comment</b> ' + data.githubComment.comment.url
    Symphony.sendMessage(streamId, answer, null, Symphony.MESSAGEML_FORMAT);
  } else {
    console.log('Comment action "' + data.githubComment.action + '" ignored')
  }
}

const parseGitHubEvent = (message) => {
  
  data = JSON.parse(message.data)
  console.log('Parsed Data: ' + JSON.stringify(data, null, 2));

  if ( data.githubPullRequest ) {
    console.log('Received githubPullRequest');
    processPullRequestEvent(message.stream.streamId, data)
  }
  if ( data.githubComment ) {
    console.log('Received githubComment');
    processCommentEvent(message.stream.streamId, data)
  }
}

const botHearsSomething = ( event, messages ) => {
  messages.forEach( (message, index) => {
    console.log('Debug: ' + JSON.stringify(message, null, 2));
    console.log('Debug Data: ' + message.data);
    if ( message.user.username === 'githubWebHookIntegration' && message.data ) {
      parseGitHubEvent(message);
    }
  })
}

Symphony.initBot(__dirname + '/config.json')
  .then( (symAuth) => {
    Symphony.getDatafeedEventsService( botHearsSomething );
  })
