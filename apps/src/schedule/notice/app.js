'use strict'
const AWS = require('aws-sdk')
const SES = new AWS.SES()
const { sender, receivers } = require('../../../config')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  const validate = request.validate(joi => {
    return {
      type: joi.string().required(),
      panid: joi.string().required(),
      name: joi.string().required(),
      mode: joi.string().required(),
      days: joi.array().max(7).items(joi.string()).required(),
      time: joi.string().required()
    }
  })
  if (validate.error) {
    return response.error(validate.messages, 422)
  }

  try {
    const actionType = request.input('type')
    const panId = request.input('panid')
    const scheduleName = request.input('name')
    const onOff = request.input('mode')
    const days = request.input('days').join(', ')
    const time = request.input('time')

    console.log('receivers', receivers)
    const params = {
      Destination: {
        ToAddresses: receivers
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
                  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
                  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                    <body style="color:#444444">
                      <h2>${actionType} Schedule</h2>
                      <h3>
                        schedule name: <span style="color:#ee1188">${scheduleName}</span><br>
                        panid: <span style="color:#ee1188">${panId}</span>
                      </h3>
                      <h3>
                        Every <span style="color:#ee1188">${days}</span><br>
                        At <span style="color:#ee1188">${time}</span><br>
                        Turn <span style="color:#ee1188">${onOff}
                      </h3>
                    </body>
                  </html>
                  `
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Lighting Control Schedule Notification'
        }
      },
      Source: sender
    }
    await SES.sendEmail(params).promise()

    return response.json({
      status: 'success'
    })
  } catch (error) {
    console.log('========Error========')
    console.log(error)
    console.log('========Error========')
    return response.error(error, error.statusCode || 500)
  }
}
