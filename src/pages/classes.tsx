import { ShoppingCartOutlined } from '@ant-design/icons';
import { FloatButton, Space, Spin } from 'antd';
import { DayCard } from 'components';
import { MonthStepper } from 'components/month-stepper';
import dayjs from 'dayjs';
import { useConfigCall } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IROrderProduct, IROrder } from 'models';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartStore } from 'stores';
import { getAllMondaysOfMonth } from 'utils';

export const Classes = observer(() => {
  const [month, setMonth] = useState(dayjs().month());
  const mondays = getAllMondaysOfMonth(month);
  const navigate = useNavigate();

  const { loading, contextHolder, orders } = useConfigCall(month);

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <MonthStepper month={month} setMonth={setMonth} />
        {mondays.map((el) => {
          const dayOrders = findDayOrders(el, orders);
          return (
            <DayCard
              day={el}
              key={el.format('MMDDYYYY')}
              data={dayOrders}
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

function findDayOrders(day: dayjs.Dayjs, arr?: IROrder[]) {
  const dayOrders: IROrderProduct[] = [];
  arr?.forEach((order) => {
    order.line_items.forEach((item) => {
      const hasDateMeta = item.meta_data.some(
        (meta) => meta.key === 'date' && day.isSame(dayjs(meta.value), 'day')
      );

      if (hasDateMeta) {
        item.order = order.id;
        dayOrders.push(item);
      }
    });
  });

  return dayOrders;
}