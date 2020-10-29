'use strict'
const AWS = require('aws-sdk')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  try {
    const panId = request.parameter('panid')
    const documentClient = new AWS.DynamoDB.DocumentClient()
    const params = {
      TableName: process.env.DATAPOOL_TABLE_NAME,
      KeyConditionExpression: 'panId = :panId',
      ExpressionAttributeValues: {
        ':panId': panId
      }
    }
    const { Items } = await documentClient.query(params).promise()

    return response.json({
      data: Items
    })
  } catch (error) {
    console.log('========Error========')
    console.log(error)
    console.log('========Error========')
  }
}
