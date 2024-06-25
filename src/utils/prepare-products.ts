import dayjs from 'dayjs';
import { ICreateProductsForm, IProduct, NameOfClass } from 'models';

export function prepareProducts(values: ICreateProductsForm) {
  const products: Pick<
    IProduct,
    'name' | 'price' | 'category_id' | 'date_time'
  >[] = [];

  for (const date of values.dates) {
    for (const el of values.classes) {
      products.push({
        name: el.label,
        price: 25,
        category_id: el.value,
        date_time: dayjs(date)
          .hour(el.label === NameOfClass.BEGINNER ? 19 : 20)
          .minute(0)
          .toDate()
      });
    }
  }

  return products;
}
