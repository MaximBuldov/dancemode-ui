import dayjs from 'dayjs';
import { ICreateProductsForm, IProduct } from 'models';

export function prepareProducts(values: ICreateProductsForm) {
  const products: Pick<
    IProduct,
    'name' | 'price' | 'date_time' | 'stock_quantity'
  >[] = [];

  const [hours, minutes] = values.time
    ? values.time.split(':').map(Number)
    : [];

  for (const date of values.dates) {
    products.push({
      name: values.name,
      price: Number(values?.regular_price || 25),
      date_time: dayjs(date)
        .hour(hours)
        .minute(minutes || 0)
        .toDate(),
      stock_quantity: Number(values?.stock_quantity || 13)
    });
  }

  return products;
}
