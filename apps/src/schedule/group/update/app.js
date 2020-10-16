'use strict'

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  console.log(request)

  return response.json({
    status: 'success'
  })
}
