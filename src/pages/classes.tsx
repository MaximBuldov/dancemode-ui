import { Empty, Space, Spin } from 'antd';
import { DayCard, MonthStepper } from 'components';
import dayjs from 'dayjs';
import { useConfigCall } from 'hooks';
import { IOrderStatus } from 'models';
import { useMemo, useState } from 'react';

export const Classes = () => {
  const [month, setMonth] = useState(dayjs());

  const { loading, contextHolder, orders, groupedProducts } = useConfigCall(month);
  const products = Object.keys(groupedProducts);
  const payedClasses = useMemo(() => {
    if (orders) {
      const pendingProductIDs: number[] = [];
      const completedProductIDs: number[] = [];

      orders.forEach(order => {
        if (order.status === IOrderStatus.PENDING) {
          order.line_items.forEach(product => {
            pendingProductIDs.push(product.product_id);
          });
        } else if (order.status === IOrderStatus.COMPLETED) {
          order.line_items.forEach(product => {
            completedProductIDs.push(product.product_id);
          });
        }
      });
      return {
        pending: pendingProductIDs,
        completed: completedProductIDs
      };
    }
  }, [orders]);
  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <MonthStepper month={month} setMonth={setMonth} />
        {products.length > 0 ? (
          products.map((el) => {
            return (
              <DayCard
                day={el}
                key={el}
                payedClasses={payedClasses}
                classes={groupedProducts[el]}
                orders={orders}
              />
            );
          }
          )) : <Empty />}
      </Space>
      {contextHolder}
    </Spin>
  );
};