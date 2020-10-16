function TransformGMTDays (schedule) {
  let days = schedule.ScheduleExpression.substr(5).split(' ')[4].split(',')
  const GMThour = Number(schedule.ScheduleExpression.substr(5).split(' ')[1])
  if (GMThour + 8 > 23) {
    days = days.map(day => {
      if (day === 'MON') return 'TUE'
      if (day === 'TUE') return 'WED'
      if (day === 'WED') return 'THU'
      if (day === 'THU') return 'FRI'
      if (day === 'FRI') return 'SAT'
      if (day === 'SAT') return 'SUN'
      if (day === 'SUN') return 'MON'
    })
  }
  return days
}
function TransformGMTHours (schedule) {
  let hour = Number(schedule.ScheduleExpression.substr(5).split(' ')[1]) + 8
  if (hour > 23) hour = hour - 24
  return hour
}
export class Schedule {
  constructor (schedule) {
    this.id = schedule.Name
    this.name = schedule.Name.split('_')[1]
    this.mode = schedule.Description.split('_')[1]
    this.time = ('0' + TransformGMTHours(schedule)).slice(-2) + ':' + ('0' + schedule.ScheduleExpression.substr(5).split(' ')[0]).slice(-2)
    this.repeat = TransformGMTDays(schedule)
    this.group = schedule.Description.split('_')[0]
    this.active = schedule.State === 'ENABLED'
  }
}
