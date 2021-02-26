'use strict'
const axios = require('axios')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  try {
    const UID = request.input('UID')
    const destMac = request.input('destMac')

    const { data } = await axios({
      method: 'post',
      url: 'https://fae.cloudpe.com:10000/api/ubec/SingleLightOn',
      headers: {
        Authorization: event.headers.Authorization
      },
      data: {
        UID,
        destMac
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
