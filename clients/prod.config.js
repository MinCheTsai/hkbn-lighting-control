// PROD
export const Auth = {
  // region: 'ap-southeast-1',
  // userPoolId: 'ap-southeast-1_4JmN3Y2lj',
  // userPoolWebClientId: '5psfjaecidia7l4ndmbj3e4ica',
  // identityPoolId: 'ap-southeast-1:d34029cc-1394-452e-aec7-d7bb506017aa'
}
export const API = {
  endpoints: [
    // {
    //   name: 'proxy-light-control',
    //   endpoint: 'https://cors-anywhere.herokuapp.com/https://fae.cloudpe.com:10000/api'
    // },
    // {
    //   name: 'schedule-api',
    //   endpoint: 'https://9m7n5kwrig.execute-api.ap-southeast-1.amazonaws.com/Prod'
    // }
  ]
}
export const Storage = {
  AWSS3: {
    // bucket: 'miap-pocjason-ap-southeast-1',
    // region: 'ap-southeast-1'
  }
}

export const user = {
  email: 'poke@softchef.com',
  password: '52657055'
}

export const gateways = [
  {
    name: 'Karin Poc',
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
        panid: '0020',
        gatewayId: 'LZ281VB3LMWW15NP111A',
        name: 'TAC_16F_Zone13',
        loading: false,
        switch: null
      },
      {
        panid: '0022',
        gatewayId: 'LZ281VB3LMWW15NP111A',
        name: 'TAC_16F_Zone9',
        loading: false,
        switch: null
      }
    ]
  }
]
