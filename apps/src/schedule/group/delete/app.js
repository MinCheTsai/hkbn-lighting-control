'use strict'
const AWS = require('aws-sdk')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  const validate = request.validate(joi => {
    return {
      statementId: joi.string().required(),
      ruleId: joi.string().required(),
      targetId: joi.string().required()
    }
  })
  if (validate.error) {
    return response.error(validate.messages, 422)
  }

  try {
    const cloudwatchevents = new AWS.CloudWatchEvents({ apiVersion: '2015-10-07' })
    const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' })

    const statementId = request.input('statementId')
    const ruleId = request.input('ruleId')
    const targetId = request.input('targetId')

    const params1 = {
      FunctionName: process.env.GroupLightsSwitchFunction_ARN,
      StatementId: statementId
    }
    await lambda.removePermission(params1).promise()

    const params2 = {
      Ids: [targetId],
      Rule: ruleId,
      Force: true
    }
    await cloudwatchevents.removeTargets(params2).promise()

    const params3 = {
      Name: ruleId,
      Force: true
    }
    await cloudwatchevents.deleteRule(params3).promise()

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
