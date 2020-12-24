export class Gateway {
  constructor (gateway) {
    this.UID = gateway.UID || 'BCA5567A123'
  }
}
export class Controller {
  constructor (controller) {
    this.mac = controller.mac || null
    this.type = controller.type || null
    this.status = controller.status || false
    this.connect = controller.status === 1 ? true : controller.status === 2
    this.switch = controller.status === 1
    this.loading = false
    this.totalTime = controller.totalTime
    this.lastUpdated = controller.lastUpdated
    this.createdTime = controller.createdTime
  }
}
export class Group {
  constructor (group) {
    this.name = group.name || 'Area A'
    this.qty = group.qty || 0
    this.switch = group.control || null
    this.loading = group.loading || false
  }
}
