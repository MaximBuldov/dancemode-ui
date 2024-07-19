import dayjs from 'dayjs';
import { ICreateProductsForm, IProduct, NameOfClass } from 'models';

export function prepareProducts(values: ICreateProductsForm) {
  const products: Pick<
    IProduct,
    'name' | 'price' | 'category_id' | 'date_time'
  >[] = [];

  const [hours, minutes] = values.time
    ? values.time.split(':').map(Number)
    : [];

  for (const date of values.dates) {
    for (const el of values.classes) {
      products.push({
        name: values?.name || el.label,
        price: 25,
        category_id: el.value,
        date_time: dayjs(date)
          .hour(hours || (el.label === NameOfClass.BEGINNER ? 19 : 20))
          .minute(minutes || 0)
          .toDate()
      });
    }
  }

  return products;
}
