import dayjs from 'dayjs';
import { IMetaData, IOrder, IProduct, IStatus } from 'models';
import { userStore } from 'stores';

export const prepareOrder = (products: IProduct[], meta_data?: IMetaData[], isReschedule = false): IOrder => {
  const months = Array.from(new Set(products.map(obj => dayjs(obj.date_time).format('YYYY-MM')))).join(',');
  return {
    customer_id: Number(userStore.data!.id),
    meta_data: [
      {
        key: IStatus.DATE,
        value: months
      }
    ],
    line_items: products.map(el => ({
      product_id: el.id,
      quantity: 1,
      subtotal: el.price,
      total: isReschedule ? '0' : (el?.total || el.price),
      meta_data
    }))
  };
};