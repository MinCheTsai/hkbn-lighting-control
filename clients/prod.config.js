// PROD
export const Auth = {
  region: 'ap-southeast-1',
  userPoolId: 'ap-southeast-1_m5IqRsoVz',
  userPoolWebClientId: '1pqt1g743u6svcpgq16a5k8q6u',
  identityPoolId: 'ap-southeast-1:df0e3b09-4277-4d97-91de-a957ada75675'
}
export const API = {
  endpoints: [
    {
      name: 'proxy-light-control',
      endpoint: 'https://cors-anywhere.herokuapp.com/https://fae.cloudpe.com:10000/api'
    },
    {
      name: 'schedule-api',
      endpoint: ' https://oqszy2n98d.execute-api.ap-southeast-1.amazonaws.com/Prod'
    }
  ]
}
export const Storage = {
  AWSS3: {
    bucket: 'karin-poc-prod-ap-southeast-1',
    region: 'ap-southeast-1'
  }
}

export const user = {
  email: 'poke@softchef.com',
  password: '52657055'
}

export const gateways = [
  {
    name: 'TAC Gateway',
    UID: 'LZ281VB3LMWW15NP111A',
    groups: [
      {
        panid: '001c',
        gatewayId: 'LZ281VB3LMWW15NP111A',
        name: 'TAC_16F_ALL',
        loading: false,
        switch: null
      },
      {
        panid: '001d',
        gatewayId: 'LZ281VB3LMWW15NP111A',
        name: 'TAC_16F_Zone1',
        loading: false,
        switch: null
      },
      {
        panid: '001e',
        gatewayId: 'LZ281VB3LMWW15NP111A',
        name: 'TAC_16F_Zone7',
        loading: false,
        switch: null
      },
      {
        panid: '001f',
        gatewayId: 'LZ281VB3LMWW15NP111A',
        name: 'TAC_16F_Zone8',
        loading: false,
        switch: null
      },
      {
        panid: '0021',
        gatewayId: 'LZ281VB3LMWW15NP111A',
        name: 'TAC_16F_Zone9',
        loading: false,
        switch: null
      },
      {
        panid: '0020',
        gatewayId: 'LZ281VB3LMWW15NP111A',
        name: 'TAC_16F_Zone13',
        loading: false,
        switch: null
      }
    ]
  }
]
