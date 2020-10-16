'use strict'
const AWS = require('aws-sdk')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  const validate = request.validate(joi => {
    return {
      active: joi.boolean().allow(null)
    }
  })
  if (validate.error) {
    return response.error(validate.messages, 422)
  }

  try {
    const cloudwatchevents = new AWS.CloudWatchEvents({ apiVersion: '2015-10-07' })

    const ruleId = request.parameter('ruleid')
    const active = request.input('active')

    const params = {
      Name: ruleId
    }
    if (active) await cloudwatchevents.enableRule(params).promise()
    else await cloudwatchevents.disableRule(params).promise()

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
