// UAT
module.exports = {
  sender: 'jasonzhuang@softchef.com',
  receivers: ['jasonzhuang@softchef.com', 'jason71708@gmail.com', 'aaronkuo@softchef.com'],
  gateways: [
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
}
