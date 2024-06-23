import { useQuery } from '@tanstack/react-query';
import { Button, Space, Spin } from 'antd';
import { AddClassModal, DayCard, MonthStepper } from 'components';
import dayjs from 'dayjs';
import { useProducts } from 'hooks';
import { IKeys } from 'models';
import { useState } from 'react';
import { userService } from 'services';

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
  const customersApi = useQuery({
    queryFn: () => userService.getCustomers({ per_page: 100 }),
    queryKey: [IKeys.CUSTOMERS]
  });

  return (
    <Spin spinning={products.isPending || customersApi.isPending}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Button block type="primary" onClick={() => setModal(true)}>
          Add class
        </Button>
        <MonthStepper month={month} setMonth={setMonth} />
        {customersApi.isSuccess &&
          Object.keys(groupedProducts).map((el) => {
            return <DayCard day={el} key={el} classes={groupedProducts[el]} />;
          })}
      </Space>
      <AddClassModal isOpen={modal} closeModal={onSuccess} />
      {message.contextHolder}
    </Spin>
  );
};
