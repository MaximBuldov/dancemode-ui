import { Dayjs } from 'dayjs';

export function getAllMondaysOfMonth(currentDate: Dayjs) {
  const firstDayOfMonth = currentDate.startOf('month');

  let firstMonday = firstDayOfMonth.day(1);

  if (firstMonday.date() !== 1) {
    firstMonday = firstMonday.day(8);
  }

  const mondays = [];

  while (firstMonday.month() === currentDate.month()) {
    mondays.push(firstMonday);
    firstMonday = firstMonday.add(7, 'day');
  }

  return mondays;
}