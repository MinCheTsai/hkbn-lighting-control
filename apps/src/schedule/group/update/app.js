'use strict'
const AWS = require('aws-sdk')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  const validate = request.validate(joi => {
    return {
      panid: joi.string().required(),
      statementId: joi.string().required(),
      ruleId: joi.string().required(),
      targetId: joi.string().required(),
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

    const uid = request.parameter('uid')
    const panid = request.input('panid')
    const statementId = request.input('statementId')
    const ruleId = request.input('ruleId')
    const targetId = request.input('targetId')
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
      Name: ruleId,
      ScheduleExpression: `cron(${min} ${GMTHour} ? * ${days.join(',')} *)`,
      Description: `${panid}_${mode}`
    }
    await cloudwatchevents.putRule(params1).promise()

    const params2 = {
      Rule: ruleId,
      Targets: [
        {
          Arn: process.env.GroupLightsSwitchFunction_ARN,
          Id: targetId,
          Input: `{ "schedule": "cloudwatch", "switch": "${mode}", "uid": "${uid}", "panid": "${panid}", "statementId": "${statementId}" }`
        }
      ]
    }
    await cloudwatchevents.putTargets(params2).promise()

    return response.json({
      data: {}
    })
  } catch (error) {
    console.log('========error========')
    console.log(error)
    console.log('========error========')
    return response.error(error, error.statusCode || 500)
  }
}
