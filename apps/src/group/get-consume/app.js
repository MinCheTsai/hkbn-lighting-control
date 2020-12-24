'use strict'
const AWS = require('aws-sdk')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  try {
    const uid = request.parameter('uid')
    const macs = request.input('macs')
    const documentClient = new AWS.DynamoDB.DocumentClient()
    const params = {
      RequestItems: {
        [process.env.DATA_TABLE]: { Keys: [] }
      }
    }
    macs.forEach(mac => {
      params.RequestItems[process.env.DATA_TABLE].Keys.push({ mac, uid })
    })
    const { Responses } = await documentClient.batchGet(params).promise()

    return response.json({
      data: Responses[process.env.DATA_TABLE]
    })
  } catch (error) {
    console.log('========Error========')
    console.log(error)
    console.log('========Error========')
    return response.error(error, error.statusCode || 500)
  }
}
