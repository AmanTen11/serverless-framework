# Codingly.io: Base Serverless Framework Template

https://codingly.io

## Serverless Framework 
```
[Serverless Framework](https://www.serverless.com/framework/docs/getting-started/) is a free and open-source framework that makes it easy to develop, deploy, manage and debug Serverless applications
```

## What's included
* Folder structure used consistently across our projects.
* [serverless-pseudo-parameters plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Allows you to take advantage of CloudFormation Pseudo Parameters.
* [serverless-bundle plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Bundler based on the serverless-webpack plugin - requires zero configuration and fully compatible with ES6/ES7 features.

## Getting started
```
sls create --name YOUR_PROJECT_NAME --template-url https://github.com/codingly-io/sls-base
cd YOUR_PROJECT_NAME
npm install
```

You are ready to go!

## Commands used :
```
* sls deploy --stage <stage_name>
* sls deploy -v
* sls deploy -f FUNCTION_NAME
* sls remove
* sls logs -f FUNCTION_NAME -t
* sls invoke -f FUNCTION_NAME -l
```