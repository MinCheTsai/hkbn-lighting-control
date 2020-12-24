'use strict'
const AWS = require('aws-sdk')
const axios = require('axios')
const { gateways } = require('../../config')

exports.handler = async(event) => {
  try {
    // =====取設備 API Token=====
    let Authorization
    const result = await axios.request({
      url: 'https://fae.cloudpe.com:10000/api/login',
      method: 'post',
      data: {
        email: process.env.TOKEN_EMAIL,
        password: process.env.TOKEN_PASSWORD
      }
    })
    if (result.data.status === 'fail') throw Error(result.data)
    else Authorization = result.data.data.token

    // =====取所有設備資料=====
    const resultControllers = await Promise.all(gateways.map(gateway => axios.request({
      url: 'https://fae.cloudpe.com:10000/api/ubec/LightingListSearch',
      method: 'post',
      headers: {
        Authorization
      },
      data: {
        UID: gateway.UID
      }
    })))
    const allControllers = []
    const onlineGatewaysUid = []
    resultControllers.forEach(result => {
      if (result.data.status !== 'success') return
      const UID = JSON.parse(result.config.data).UID
      onlineGatewaysUid.push(UID)
      allControllers.push(...result.data.data.map(controller => {
        return {
          mac: controller.mac,
          status: controller.status === 1,
          uid: UID
        }
      }))
    })
    console.log('onlineGatewaysUid', onlineGatewaysUid)
    console.log('allControllers', allControllers)

    // =====取資料庫裡的設備資料(用有在連線中的 UID 去查)=====
    const documentClient = new AWS.DynamoDB.DocumentClient()
    const dbResults = await Promise.all(onlineGatewaysUid.map(uid => {
      const params = {
        TableName: process.env.DATA_TABLE,
        IndexName: 'query-by-uid',
        KeyConditionExpression: 'uid = :uid',
        ExpressionAttributeValues: {
          ':uid': uid
        }
      }
      return documentClient.query(params).promise()
    }))
    const allDbControllersData = []
    dbResults.forEach(({ Items }) => {
      allDbControllersData.push(...Items)
    })
    console.log('allDbControllersData', allDbControllersData)

    // =====比對資料庫與目前設備的資料，並更新燈亮狀態與累積開燈時間(若資料庫沒有該設備，則新增)=====
    const INTERVAL_TIME = process.env.INTERVAL_TIME
    const timeEquation = 8 * 60 * 60 * 1000 // GMT +8:00
    const updateControllerData = []
    const newRawData = []
    allControllers.forEach(controller => {
      const dbController = allDbControllersData.find(dbController => dbController.mac === controller.mac)
      if (dbController) {
        let newTotalTime = dbController.totalTime + (dbController.status && controller.status ? Number(INTERVAL_TIME) : 0)
        if (dbController.status && controller.status) {
          newRawData.push({
            mac: dbController.mac,
            uid: dbController.uid,
            duration: Number(INTERVAL_TIME),
            timestamp: Date.now() + timeEquation
          })
        }
        updateControllerData.push(Object.assign({}, dbController, { status: controller.status, totalTime: newTotalTime, lastUpdated: Date.now() + timeEquation }))
      } else {
        updateControllerData.push(Object.assign({}, controller, { totalTime: 0, lastUpdated: Date.now() + (8 * 60 * 60 * 1000), createdTime: Date.now() + timeEquation }))
        if (controller.status) {
          newRawData.push({
            mac: controller.mac,
            uid: controller.uid,
            duration: Number(INTERVAL_TIME),
            timestamp: Date.now() + timeEquation
          })
        }
      }
    })
    console.log('updateControllerData', updateControllerData)
    console.log('newRawData', newRawData)

    // =====寫入 DB，一個存總開燈時數與狀態，另個存單次紀錄時數=====
    if (updateControllerData.length > 1) {
      const params = {
        RequestItems: { [process.env.DATA_TABLE]: [] }
      }
      updateControllerData.forEach(controller => {
        params.RequestItems[process.env.DATA_TABLE].push({
          PutRequest: {
            Item: controller
          }
        })
      })
      await documentClient.batchWrite(params).promise()
    }
    if (newRawData.length > 1) {
      const params = {
        RequestItems: { [process.env.RAW_TABLE]: [] }
      }
      newRawData.forEach(rawData => {
        params.RequestItems[process.env.RAW_TABLE].push({
          PutRequest: {
            Item: rawData
          }
        })
      })
      await documentClient.batchWrite(params).promise()
    }
  } catch (error) {
    console.log('========Error========')
    console.log(error)
    console.log('========Error========')
  }
}
