import dayjs, { Dayjs } from 'dayjs';

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

export function getAllMondaysInRange(startMonth: string, endMonth: string) {
  const mondaysInRange = [];
  const start = dayjs(startMonth);
  const end = dayjs(endMonth);

  if (start.isSame(end)) {
    mondaysInRange.push(...getAllMondaysOfMonth(start));
  } else {
    for (let month = start; month.isSame(end, 'month') || month.isBefore(end, 'month'); month = month.add(1, 'month')) {
      const mondaysInMonth = getAllMondaysOfMonth(month);
      mondaysInRange.push(...mondaysInMonth);
    }
  }

  return mondaysInRange;
}