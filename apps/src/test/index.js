'use strict'
const AWS = require('aws-sdk')
// const axios = require('axios')

// const cloudwatchevents = new AWS.CloudWatchEvents({ apiVersion: '2015-10-07', region: 'ap-southeast-1', accessKeyId: 'AKIAQLUV6SKCW5BYBTWT', secretAccessKey: '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' })
// const lambda = new AWS.Lambda({ apiVersion: '2015-03-31', region: 'ap-southeast-1', accessKeyId: 'AKIAQLUV6SKCW5BYBTWT', secretAccessKey: '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' })

// const params = {
//   Name: 'poc-test-rule-fdfef4cdf', // + Math.random().toString(36).substring(4),
//   ScheduleExpression: 'cron(00 01 ? * MON,TUE,WED,THU,FRI,SAT,SUN *)',
//   State: 'ENABLED',
//   Description: 'jason-test3'
// }
// cloudwatchevents
//   .putRule(params, (err, data) => {
//     console.log(data)
//     console.log(err)
//   })

// =========================================================

// const params = {
//   NamePrefix: 'web',
//   Limit: 10,
//   NextToken: null
// }

// cloudwatchevents
//   .listRules(params, (err, data) => {
//     console.log(data)
//     console.log(err)
//   })

// =========================================================

// const params2 = {
//   Rule: 'poc-test-rule-fdfef4cdf',
//   Targets: [
//     {
//       Arn: 'arn:aws:lambda:ap-southeast-1:025010541189:function:dev-hkb-poc-GroupLightsSwitchFunction-76ATJFNSH3G8',
//       Id: 'bqmmohm4q',
//       Input: '{ "schedule": "cloudwatch", "switch": "off", "uid": "26YG1C9ZPTAHXNT5111A", "panid": "0016" }'
//     }
//   ]
// }

// cloudwatchevents
//   .putTargets(params2, (err, data) => {
//     console.log(data)
//     console.log(err)
//   })

// =========================================================

// const params2 = {
//   Rule: 'poc-test-rule-svkk2gpwq',
//   Limit: 10,
//   NextToken: null
// }

// cloudwatchevents
//   .listTargetsByRule(params2, (err, data) => {
//     console.log(data)
//     console.log(err)
//   })

// =========================================================

// const params = {
//   Action: 'lambda:InvokeFunction',
//   FunctionName: 'arn:aws:lambda:ap-southeast-1:025010541189:function:dev-hkb-poc-GroupLightsSwitchFunction-76ATJFNSH3G8',
//   Principal: 'events.amazonaws.com',
//   SourceArn: 'arn:aws:events:ap-southeast-1:025010541189:rule/web-test03_sj4927zd',
//   StatementId: 'tefdfsf4r34cdst'
// }
// lambda
//   .addPermission(params, (err, data) => {
//     console.log(data)
//     console.log(err)
//   })

// =========================================================

// const params = {
//   Ids: ['bqmmohm4q'],
//   Rule: 'poc-test-rule-nkjbhkhkkk',
//   Force: true
// }
// cloudwatchevents
//   .removeTargets(params, (err, data) => {
//     console.log(data)
//     console.log(err)
//   })

// =========================================================

// const params2 = {
//   Name: 'poc-test-rule-nkjbhkhkkk',
//   Force: true
// }
// cloudwatchevents
//   .deleteRule(params2, (err, data) => {
//     console.log(data)
//     console.log(err)
//   })

// =========================================================

// const params3 = {
//   FunctionName: 'arn:aws:lambda:ap-southeast-1:025010541189:function:dev-hkb-poc-GroupLightsSwitchFunction-76ATJFNSH3G8',
//   StatementId: 'sd3fsdadsa'
// }
// lambda
//   .removePermission(params3, (err, data) => {
//     console.log(data)
//     console.log(err)
//   })
