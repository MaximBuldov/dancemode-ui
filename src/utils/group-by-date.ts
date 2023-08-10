import dayjs from 'dayjs';
import { IProduct } from 'models';

interface GroupedData {
  [key: string]: IProduct[]; // Define an index signature for the object
}

export function groupByDate(data?: IProduct[]) {
  const groupedData: GroupedData = {};

  if (data) {
    data
      .sort((a, b) => {
        const dateA = dayjs(a.date_time);
        const dateB = dayjs(b.date_time);
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      })
      .forEach(item => {
        const dateOnly = dayjs(item.date_time).format('YYYY-MM-DD');
        if (!groupedData[dateOnly]) {
          groupedData[dateOnly] = [];
        }
        groupedData[dateOnly].push(item);
      });

  }

  return groupedData;
}