export class Gateway {
  constructor (gateway) {
    this.mac = gateway.name || 'BCA5567A123'
    this.location = gateway.location || 'TAC-14F'
    this.status = gateway.status || false
    this.updateAt = gateway.updateAt || 1601882935631
  }
}
export class Controller {
  constructor (controller) {
    this.mac = controller.name || null
    this.location = controller.location || null
    this.status = controller.status || false
    this.switch = controller.control || false
    this.gateway = controller.gateway || 'BCA5567A123'
  }
}
export class Group {
  constructor (group) {
    this.name = group.name || 'Area A'
    this.location = group.location || 'TAC-14F'
    this.qty = group.qty || 0
    this.switch = group.control || false
  }
}
