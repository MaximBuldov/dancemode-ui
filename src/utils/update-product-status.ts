import { QueryClient } from '@tanstack/react-query';
import { Key } from 'antd/es/table/interface';
import { IKeys, IProduct } from 'models';

export function updateProductStatus(
  client: QueryClient,
  month: string,
  product_id: number,
  ordersId: Key[],
  productStatus?: string
) {
  client.setQueryData(
    [IKeys.PRODUCTS, { month }],
    (products: IProduct[] | undefined) =>
      products?.map((el) =>
        el.id === product_id
          ? {
              ...el,
              orders: el.orders.map((order) =>
                ordersId.includes(order.id)
                  ? {
                      ...order,
                      productStatus
                    }
                  : order
              )
            }
          : el
      )
  );
}
