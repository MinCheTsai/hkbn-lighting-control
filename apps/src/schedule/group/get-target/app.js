'use strict'
const AWS = require('aws-sdk')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  try {
    const cloudwatchevents = new AWS.CloudWatchEvents({ apiVersion: '2015-10-07' })

    const Rule = request.parameter('ruleid')

    const params = {
      Rule,
      Limit: 10,
      NextToken: null
    }
    const data = await cloudwatchevents.listTargetsByRule(params).promise()

    return response.json(data)
  } catch (error) {
    console.log('========error========')
    console.log(error)
    console.log('========error========')
    return response.error(error, error.statusCode || 500)
  }
}
