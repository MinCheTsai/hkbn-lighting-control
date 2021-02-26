'use strict'
const axios = require('axios')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  try {
    const UID = request.input('UID')
    const PanID = request.input('PanID')

    const { data } = await axios({
      method: 'post',
      url: 'https://fae.cloudpe.com:10000/api/ubec/GroupLightOff',
      headers: {
        Authorization: event.headers.Authorization
      },
      data: {
        UID,
        PanID
      }
    })

    return response.json(data)
  } catch (error) {
    console.log('========Error========')
    console.log(error)
    console.log('========Error========')
    return response.error(error, error.statusCode || 500)
  }
}
