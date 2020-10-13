'use strict'
// const axios = require('axios')

exports.handler = async(event) => {
  const { Request, Response } = require('softchef-utility')
  const request = new Request(event)
  const response = new Response()

  try {
    console.log('event', request.event)
    console.log('body', request.body)
    console.log('body', request.parameters)
    //   const language = request.input('language')
    //   const recaptchaSecret = googleRecaptchaKeys[language]
    //   const recaptchaResponse = request.input('g_recaptcha_response')
    //   const recaptchaResult = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaResponse}`)
    //   if (!recaptchaResult.data.success) {
    //     return response.error('recaptcha false', 422)
    //   }

    //   // db8f8b9911: NodesFLY Subscribed
    //   // 20a59ebbc3: E-Bike Form
    //   const interests = request.input('interests', { 'db8f8b9911': true, '20a59ebbc3': true })

    //   // eac77e1562: SoftChef
    //   const listId = request.input('listId', 'eac77e1562')
    //   const email = request.input('email', 'poke@softchef.com')
    //   const memberId = md5(email)

    //   let params = {
    //     email_address: email,
    //     status_if_new: 'subscribed',
    //     status: 'subscribed',
    //     language: language,
    //     interests: interests,
    //     merge_fields: {
    //       FNAME: request.input('first_name'),
    //       LNAME: request.input('last_name'),
    //       COMPANY: request.input('company_name'),
    //       JOB: request.input('job'),
    //       INDUSTRY: request.input('industry')
    //     }
    //   }
    //   await mailchimp.put(`/lists/${listId}/members/${memberId}`, params)
    return response.json({
      event: request.event,
      body: request.body,
      parameters: request.parameters
    })
  } catch (error) {
    return response.error(error)
  }
}
