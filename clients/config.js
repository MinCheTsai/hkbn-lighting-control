// PROD
export const Env = {
  isPoc: true
}
export const Auth = {
  region: 'ap-southeast-1',
  userPoolId: 'ap-southeast-1_zc7j8dGPC',
  userPoolWebClientId: '5hgsemve497bea2pidgo33ki88',
  identityPoolId: 'ap-southeast-1:1d298d93-d911-42ef-8a03-ee1b7e87d9c3'
}
export const API = {
  endpoints: [
    {
      name: 'lambda-api',
      endpoint: 'https://lj52tp5uy3.execute-api.ap-southeast-1.amazonaws.com/Prod'
    }
  ]
}
export const Storage = {
  AWSS3: {
    bucket: 'karin-hkbn-ap-southeast-1',
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
