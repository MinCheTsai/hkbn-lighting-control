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
        [process.env.DATAPOOL_TABLE_NAME]: { Keys: [] }
      }
    }
    macs.forEach(mac => {
      params.RequestItems[process.env.DATAPOOL_TABLE_NAME].Keys.push({ mac, uid })
    })
    const { Responses } = await documentClient.batchGet(params).promise()

    return response.json({
      data: Responses[process.env.DATAPOOL_TABLE_NAME]
    })
  } catch (error) {
    console.log('========Error========')
    console.log(error)
    console.log('========Error========')
  }
}
