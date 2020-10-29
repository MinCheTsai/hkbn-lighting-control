'use strict'
const AWS = require('aws-sdk')
const axios = require('axios')
const _ = require('lodash')
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

    // =====取目前設備資料=====
    const allGroups = _.flatten(gateways.map(gateway => gateway.groups))
    const resultControllers = await Promise.all(allGroups.map(group => axios.request({
      url: 'https://fae.cloudpe.com:10000/api/ubec/GroupStatusSearch',
      method: 'post',
      headers: {
        Authorization
      },
      data: {
        PanID: group.panid,
        UID: group.gatewayId
      }
    })))
    const allControllers = []
    const onlineGroupsId = []
    resultControllers.forEach(result => {
      if (result.data.status !== 'success') return
      const panId = JSON.parse(result.config.data).PanID
      onlineGroupsId.push(panId)
      allControllers.push(...result.data.data.map(controller => {
        return {
          mac: controller.mac,
          status: controller.status === 1,
          panId: panId
        }
      }))
    })
    console.log('onlineGroupsId', onlineGroupsId)
    console.log('allControllers', allControllers)

    // =====取資料庫裡的設備資料(用有在連線中的 GroupId 去查)=====
    const documentClient = new AWS.DynamoDB.DocumentClient()
    const dbResults = await Promise.all(onlineGroupsId.map(groupId => {
      const params = {
        TableName: process.env.DATAPOOL_TABLE_NAME,
        KeyConditionExpression: 'panId = :panId',
        ExpressionAttributeValues: {
          ':panId': groupId
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
    const updateControllerData = []
    allControllers.forEach(controller => {
      const dbController = allDbControllersData.find(dbController => dbController.mac === controller.mac)
      if (dbController) {
        const newTotalTime = dbController.totalTime + (dbController.status && controller.status ? 15 : 0)
        updateControllerData.push(Object.assign({}, dbController, { status: controller.status, totalTime: newTotalTime }))
      } else {
        updateControllerData.push(Object.assign({}, controller, { totalTime: 0 }))
      }
    })
    console.log('updateControllerData', updateControllerData)

    const params = {
      RequestItems: { [process.env.DATAPOOL_TABLE_NAME]: [] }
    }
    updateControllerData.forEach(controller => {
      params.RequestItems[process.env.DATAPOOL_TABLE_NAME].push({
        PutRequest: {
          Item: controller
        }
      })
    })
    await documentClient.batchWrite(params).promise()
  } catch (error) {
    console.log('========Error========')
    console.log(error)
    console.log('========Error========')
  }
}
