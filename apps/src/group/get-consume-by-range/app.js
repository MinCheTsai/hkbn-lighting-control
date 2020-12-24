'use strict'
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  try {
    const macs = request.input('macs') // ['string', 'string', ...]
    const group = request.input('group') // { name: 'string', panid: 'string' }
    const range = request.input('range') // { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }

    const startTime = new Date(range.from).getTime()
    const endTime = new Date(range.to).getTime() + (24 * 60 * 60 * 1000)

    const results = await Promise.all(macs.map(mac => {
      return queryHandler(new QueryParams(process.env.RAW_TABLE, mac, startTime, endTime))
    }))
    const data = results.map(result => {
      return result.reduce((pre, cur) => {
        if (pre) {
          pre.updateData(cur)
          return pre
        }
        return new StatiData(cur)
      }, null)
    })
    return response.json({
      data,
      group
    })
  } catch (error) {
    console.log('========Error========')
    console.log(error)
    console.log('========Error========')
    return response.error(error, error.statusCode || 500)
  }
}

class QueryParams {
  constructor(tableName, hKey, startTime, endTime) {
    this.TableName = tableName
    this.KeyConditionExpression = 'mac = :hkey and #timestamp between :startTime and :endTime'
    this.ExpressionAttributeNames = {
      '#timestamp': 'timestamp'
    }
    this.ExpressionAttributeValues = {
      ':hkey': hKey,
      ':startTime': startTime,
      ':endTime': endTime
    }
  }
}

class StatiData {
  constructor({ mac, duration, timestamp }) {
    this.mac = mac
    this.duration = duration
    this.firstUpdate = timestamp
    this.lastUpdate = timestamp
  }
  updateData({ duration, timestamp }) {
    this.duration += duration
    this.firstUpdate = this.firstUpdate < timestamp ? this.firstUpdate : timestamp
    this.lastUpdate = this.lastUpdate > timestamp ? this.lastUpdate : timestamp
  }
}

async function queryHandler(params) {
  try {
    const result = []
    const response = await documentClient.query(params).promise()
    result.push(...response.Items)
    if (response.LastEvaluatedKey) {
      const anotherParams = Object.assign(params, { ExclusiveStartKey: response.LastEvaluatedKey })
      const anotherResponse = await queryHandler(anotherParams).promise()
      result.push(...anotherResponse)
    }
    return result
  } catch (error) {
    throw new Error(error)
  }
}
