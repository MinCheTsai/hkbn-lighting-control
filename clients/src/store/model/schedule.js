export class Schedule {
  constructor (schedule) {
    this.id = schedule.Name
    this.name = schedule.Name.split('_')[1]
    this.mode = schedule.Description.split('_')[1]
    this.time = ('0' + schedule.ScheduleExpression.substr(5).split(' ')[1]).slice(-2) + ':' + ('0' + schedule.ScheduleExpression.substr(5).split(' ')[0]).slice(-2)
    this.repeat = schedule.ScheduleExpression.substr(5).split(' ')[4].split(',')
    this.group = schedule.Description.split('_')[0]
    this.active = schedule.State === 'ENABLED'
  }
}
