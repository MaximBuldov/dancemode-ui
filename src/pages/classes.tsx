import { Empty, Space, Spin } from 'antd';
import { DayCard, MonthStepper } from 'components';
import dayjs from 'dayjs';
import { useProducts } from 'hooks';
import { useState } from 'react';

export const Classes = () => {
  const [month, setMonth] = useState(dayjs());
  const { groupedProducts, products: productsApi } = useProducts(month);

  const products = Object.keys(groupedProducts);

  return (
    <Spin spinning={productsApi.isFetching}>
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <MonthStepper month={month} setMonth={setMonth} />
        {products.length > 0 ? (
          products.map((el) => {
            return <DayCard day={el} key={el} classes={groupedProducts[el]} />;
          })
        ) : (
          <Empty />
        )}
      </Space>
    </Spin>
  );
};
