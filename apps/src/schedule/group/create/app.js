'use strict'
const AWS = require('aws-sdk')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  const validate = request.validate(joi => {
    return {
      panid: joi.string().required(),
      name: joi.string().required(),
      switch: joi.string().required(),
      days: joi.array().max(7).items(joi.string()).required(),
      time: joi.string().required()
    }
  })
  if (validate.error) {
    return response.error(validate.messages, 422)
  }

  try {
    const cloudwatchevents = new AWS.CloudWatchEvents({ apiVersion: '2015-10-07' })
    const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' })

    const uid = request.parameter('uid')
    const panid = request.input('panid')
    const name = `poc-${uid}_` + request.input('name')
    // const name = `poc-${uid}_` + request.input('name') + '_' + Math.random().toString(36).substring(9)
    const mode = request.input('switch')
    let days = request.input('days')
    const time = request.input('time')
    const hour = time.split(':')[0]
    const min = time.split(':')[1]
    let GMTHour = Number(hour) - 8
    if (GMTHour < 0) {
      GMTHour = GMTHour + 24
      days = days.map(day => {
        if (day === 'MON') return 'SUN'
        if (day === 'TUE') return 'MON'
        if (day === 'WED') return 'TUE'
        if (day === 'THU') return 'WED'
        if (day === 'FRI') return 'THU'
        if (day === 'SAT') return 'FRI'
        if (day === 'SUN') return 'SAT'
        throw Error({ message: 'Days Format Error', statusCode: 422 })
      })
    }

    const params1 = {
      Name: name,
      ScheduleExpression: `cron(${min} ${GMTHour} ? * ${days.join(',')} *)`,
      State: 'ENABLED',
      Description: `${panid}_${mode}`
    }
    const { RuleArn } = await cloudwatchevents.putRule(params1).promise()

    const StatementId = Math.random().toString(36).substring(4)
    const params2 = {
      Action: 'lambda:InvokeFunction',
      FunctionName: process.env.GroupLightsSwitchFunction_ARN,
      Principal: 'events.amazonaws.com',
      SourceArn: RuleArn,
      StatementId
    }
    await lambda.addPermission(params2).promise()

    const params3 = {
      Rule: name,
      Targets: [
        {
          Arn: process.env.GroupLightsSwitchFunction_ARN,
          Id: 'bqmmohm4q',
          Input: `{ "schedule": "cloudwatch", "switch": "${mode}", "uid": "${uid}", "panid": "${panid}", "statementId": "${StatementId}" }`
        }
      ]
    }
    await cloudwatchevents.putTargets(params3).promise()

    return response.json({
      data: name
    })
  } catch (error) {
    console.log('========error========')
    console.log(error)
    console.log('========error========')
    return response.error(error, error.statusCode || 500)
  }
}
