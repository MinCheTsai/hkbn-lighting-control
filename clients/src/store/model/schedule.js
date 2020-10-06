export class Schedule {
  constructor (schedule) {
    this.name = schedule.name || '14F-Vacation'
    this.mode = schedule.mode || 'Open'
    this.time = schedule.time || '06:00'
    this.repeat = schedule.repeat || ['Mon', 'Wed', 'Fri']
    this.group = schedule.group || 'Area A'
    this.active = schedule.active || false
  }
}
