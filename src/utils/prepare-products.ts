import { ICreateProductsForm, NameOfClass } from 'models';
import dayjs from 'dayjs';

export function prepareProducts(values: ICreateProductsForm) {
  const products = [];

  for (const date of values.dates) {
    for (const el of values.classes) {
      products.push({
        name: el.label,
        regular_price: '25',
        categories: [{ id: el.value }],
        meta_data: [
          {
            key: 'date_time',
            value: dayjs(date).hour(el.label === NameOfClass.BEGINNER ? 19 : 20).minute(0).format('YYYY-MM-DD HH:mm')
          }
        ]
      });
    }
  }

  return { create: products };
}