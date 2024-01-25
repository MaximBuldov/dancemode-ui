import { ShoppingCartOutlined } from '@ant-design/icons';
import { Empty, FloatButton, Space, Spin } from 'antd';
import { DayCard, MonthStepper } from 'components';
import dayjs from 'dayjs';
import { useConfigCall } from 'hooks';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartStore } from 'stores';

export const Classes = observer(() => {
  // eslint-disable-next-line no-console
  console.log({ key: process.env.REACT_APP_STRIPE_PUBLIC_KEY, url: process.env.REACT_APP_API_URL, wc: process.env.REACT_APP_WC_KEY });

  const [month, setMonth] = useState(dayjs());
  const navigate = useNavigate();

  const { loading, contextHolder, orders, groupedProducts } = useConfigCall(month);
  const products = Object.keys(groupedProducts);
  const payedClasses = useMemo(() => orders?.flatMap(order => order.line_items.map(el => el.product_id)), [orders]);
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
      {!!cartStore.count && (
        <FloatButton
          icon={<ShoppingCartOutlined />}
          type="primary"
          style={{ bottom: 80 }}
          badge={{ count: cartStore.count }}
          onClick={() => navigate('/cart')}
        />
      )}
      {contextHolder}
    </Spin>
  );
});