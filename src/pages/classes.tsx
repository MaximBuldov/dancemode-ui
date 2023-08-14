import { ShoppingCartOutlined } from '@ant-design/icons';
import { FloatButton, Space, Spin } from 'antd';
import { DayCard, MonthStepper } from 'components';
import dayjs from 'dayjs';
import { useConfigCall } from 'hooks';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartStore } from 'stores';

export const Classes = observer(() => {
  const [month, setMonth] = useState(dayjs());
  const navigate = useNavigate();

  const { loading, contextHolder, orders, groupedProducts } = useConfigCall(month);

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <MonthStepper month={month} setMonth={setMonth} />
        {Object.keys(groupedProducts).map((el) => {
          return (
            <DayCard
              day={el}
              key={el}
              orders={orders}
              classes={groupedProducts[el]}
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