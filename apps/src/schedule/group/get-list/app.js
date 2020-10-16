'use strict'
const AWS = require('aws-sdk')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  const validate = request.validate(joi => {
    return {
      nextToken: joi.string().allow(null)
    }
  })
  if (validate.error) {
    return response.error(validate.messages, 422)
  }

  try {
    const cloudwatchevents = new AWS.CloudWatchEvents({ apiVersion: '2015-10-07' })

    const uid = request.parameter('uid')
    const NextToken = request.input('nextToken')

    const params = {
      NamePrefix: `poc-light-control-${uid}`,
      Limit: 10,
      NextToken
    }
    const data = await cloudwatchevents.listRules(params).promise()

    return response.json(data)
  } catch (error) {
    console.log('========error========')
    console.log(error)
    console.log('========error========')
    return response.error(error, error.statusCode || 500)
  }
}
