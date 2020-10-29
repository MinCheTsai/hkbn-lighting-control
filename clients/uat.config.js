// UAT
export const Auth = {
  region: 'ap-southeast-1',
  userPoolId: 'ap-southeast-1_UqUOKOppy',
  userPoolWebClientId: '30cq025timi91rpft7k3v9pvn2',
  identityPoolId: 'ap-southeast-1:e03080ce-d5c7-4b86-a6f7-b931d70eabbc'
}
export const API = {
  endpoints: [
    {
      name: 'proxy-light-control',
      endpoint: 'https://cors-anywhere.herokuapp.com/https://fae.cloudpe.com:10000/api'
    },
    {
      name: 'schedule-api',
      endpoint: 'https://t6h8nghnr6.execute-api.ap-southeast-1.amazonaws.com/Prod'
    }
  ]
}
export const Storage = {
  AWSS3: {
    bucket: 'poc-karin-uat-ap-southeast-1',
    region: 'ap-southeast-1'
  }
}

export const user = {
  email: 'poke@softchef.com',
  password: '52657055'
}

export const gateways = [
  {
    name: 'Karin ubec Demo',
    UID: 'PYK9AW4GRZRTNHYU111A',
    groups: [
      {
        panid: '0014',
        gatewayId: 'PYK9AW4GRZRTNHYU111A',
        name: 'test2',
        loading: false,
        switch: null
      }
    ]
  },
  {
    name: 'SoftChef Test',
    UID: '26YG1C9ZPTAHXNT5111A',
    groups: [
      {
        panid: '0016',
        gatewayId: '26YG1C9ZPTAHXNT5111A',
        name: 'test',
        loading: false,
        switch: null
      }
    ]
  }
]

// export const controllers = [
//   {
//     mac: 'ACB859FF00883F1D'
//   },
//   {
//     mac: 'ACB859FF00883EBB'
//   },
//   ==========================
//   {
//     mac: 'ACB859FF00A806EF'
//   },
//   {
//     mac: 'ACB859FF00A80698'
//   },
//   {
//     mac: 'ACB859FF00883032'
//   },
//   {
//     mac: 'ACB859FF00A80685'
//   }
// ]
