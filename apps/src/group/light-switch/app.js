'use strict'
const axios = require('axios')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  let groupSwitch
  let UID
  let PanID
  let Authorization

  try {
    if (event.schedule) {
      groupSwitch = event.switch === 'on'
      UID = event.uid
      PanID = event.panid
      Authorization = null
    } else {
      groupSwitch = request.parameter('switch') === 'on'
      UID = request.get('uid', null)
      PanID = request.get('panid', null)
      Authorization = request.input('authorization', null)
    }
    if (!Authorization) {
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
    }

    const result = await axios.request({
      url: `https://fae.cloudpe.com:10000/api/ubec/GroupLight${groupSwitch ? 'On' : 'Off'}`,
      method: 'post',
      headers: {
        Authorization
      },
      data: {
        UID,
        PanID
      }
    })
    if (result.data.status === 'fail') throw Error(result.data)
    console.log('==========result Start==========')
    console.log(result)
    console.log('==========result End==========')
    return response.json({
      data: {}
    })
  } catch (error) {
    console.log('==========Error Start==========')
    console.log(error)
    console.log('==========Error End==========')
    return response.error(error)
  }
}
