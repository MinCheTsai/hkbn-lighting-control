'use strict'
const axios = require('axios')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  try {
    const email = request.input('email')
    const password = request.input('password')

    const { data } = await axios({
      method: 'post',
      url: 'https://fae.cloudpe.com:10000/api/login',
      data: {
        email,
        password
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
