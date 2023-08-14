import { ICreateProductsForm, NameOfClass } from 'models';
import dayjs from 'dayjs';

import { getAllMondaysInRange } from './get-all-mondays';

export function prepareProducts(values: ICreateProductsForm) {
  const allMondays = getAllMondaysInRange(values.months.map(el => el.month()));
  const products = [];

  for (const date of allMondays) {
    for (const name of values.classes) {
      products.push({
        name,
        regular_price: '25',
        virtual: true,
        meta_data: [
          {
            key: 'date_time',
            value: dayjs(date).hour(name === NameOfClass.BEGINNER ? 19 : 20).minute(0).format('YYYY-MM-DD HH:mm')
          }
        ]
      });
    }
  }
  const data = {
    create: products
  };

  return data;
}