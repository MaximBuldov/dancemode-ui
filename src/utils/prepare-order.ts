import { ICartProduct, IMetaData, IOrder, IStatus } from 'models';
import { userStore } from 'stores';

export const prepareOrder = (products: ICartProduct[], meta: IMetaData[] = [], isReschedule = false): IOrder => {
  const months = Array.from(new Set(products.map(obj => obj.month))).join('');
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
      meta_data: [
        {
          key: 'date',
          value: el.day
        },
        ...meta
      ]
    }))
  };
};