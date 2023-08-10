import dayjs from 'dayjs';

export function getAllMondaysOfMonth(month: number) {
  const currentDate = dayjs().month(month);

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

export function getAllMondaysInRange(range: number[]) {
  const [startMonth, endMonth] = range;
  const mondaysInRange = [];

  if (startMonth === endMonth) {
    mondaysInRange.push(...getAllMondaysOfMonth(startMonth));
  } else {
    for (let month = startMonth; month <= endMonth; month++) {
      const mondaysInMonth = getAllMondaysOfMonth(month);
      mondaysInRange.push(...mondaysInMonth);
    }
  }

  return mondaysInRange;
}