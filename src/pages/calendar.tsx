import { Button, Space, Spin } from 'antd';
import { AddClassModal, DayCard, MonthStepper } from 'components';
import dayjs from 'dayjs';
import { useProducts } from 'hooks';
import { useState } from 'react';

export const Calendar = () => {
  const [modal, setModal] = useState(false);
  const [month, setMonth] = useState(dayjs());
  const { groupedProducts, message, products } = useProducts(month);
  const onSuccess = (isSuccess: boolean) => {
    setModal(false);
    if (isSuccess) {
      message.messageApi.success('Success!');
    }
  };

  return (
    <Spin spinning={products.isLoading}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Button block type="primary" onClick={() => setModal(true)}>Add class</Button>
        <MonthStepper month={month} setMonth={setMonth} />
        {Object.keys(groupedProducts).map((el) => {
          return (
            <DayCard
              day={el}
              key={el}
              classes={groupedProducts[el]}
            />
          );
        }
        )}
      </Space>
      <AddClassModal isOpen={modal} closeModal={onSuccess} />
      {message.contextHolder}
    </Spin>
  );
};