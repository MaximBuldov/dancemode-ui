import { ShoppingCartOutlined } from '@ant-design/icons';
import { FloatButton, Space, Spin } from 'antd';
import { DayCard } from 'components';
import { MonthStepper } from 'components/month-stepper';
import dayjs from 'dayjs';
import { useConfigCall } from 'hooks';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartStore } from 'stores';
import { groupByDate } from 'utils';

export const Classes = observer(() => {
  const [month, setMonth] = useState(dayjs());
  const navigate = useNavigate();

  const { loading, contextHolder, orders, products } = useConfigCall(month);

  const days = useMemo(() => groupByDate(products), [products]);

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <MonthStepper month={month} setMonth={setMonth} />
        {Object.keys(days).map((el) => {
          return (
            <DayCard
              day={el}
              key={el}
              orders={orders}
              classes={days[el]}
            />
          );
        }
        )}
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