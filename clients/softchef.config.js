export const Auth = {
  region: 'ap-southeast-1',
  userPoolId: 'ap-southeast-1_4JmN3Y2lj',
  userPoolWebClientId: '5psfjaecidia7l4ndmbj3e4ica',
  identityPoolId: 'ap-southeast-1:d34029cc-1394-452e-aec7-d7bb506017aa'
}
export const API = {
  endpoints: [
    {
      name: 'proxy-light-control',
      endpoint: 'https://cors-anywhere.herokuapp.com/https://fae.cloudpe.com:10000/api'
    }
  ]
}
export const Storage = {
  AWSS3: {
    bucket: 'miap-pocjason-ap-southeast-1',
    region: 'ap-southeast-1'
  }
}

export const user = {
  email: 'poke@softchef.com',
  password: '52657055'
}

export const gateways = [
  {
    UID: '26YG1C9ZPTAHXNT5111A'
  }
]

export const groups = [
  {
    panID: '0016'
  }
]

export const controllers = [
  {
    mac: 'ACB859FF00883F1D'
  },
  {
    mac: 'ACB859FF00883EBB'
  }
]
