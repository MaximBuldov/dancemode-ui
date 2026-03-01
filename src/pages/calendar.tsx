import { useQuery } from '@tanstack/react-query';
import { App, Button, Space, Spin } from 'antd';
import {
  AddClassModal,
  CreateBundleModal,
  DayCard,
  MonthStepper
} from 'components';
import dayjs from 'dayjs';
import { useProducts } from 'hooks';
import { IKeys } from 'models';
import { useState } from 'react';
import { userService } from 'services';

export const Calendar = () => {
  const [modal, setModal] = useState(false);
  const [bundleModal, setBundleModal] = useState(false);
  const [month, setMonth] = useState(dayjs());
  const { message } = App.useApp();
  const { groupedProducts, products } = useProducts(month);
  const onSuccess = (isSuccess: boolean) => {
    setModal(false);
    if (isSuccess) {
      message.success('Success!');
    }
  };
  const customersApi = useQuery({
    queryFn: () => userService.getCustomers({ all: true }),
    queryKey: [IKeys.CUSTOMERS]
  });

  return (
    <Spin spinning={products.isPending || customersApi.isPending}>
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <Space.Compact block>
          <Button block type="primary" onClick={() => setModal(true)}>
            Add class
          </Button>
          <Button
            block
            type="primary"
            danger
            onClick={() => setBundleModal(true)}
          >
            Create bundle
          </Button>
        </Space.Compact>

        <MonthStepper month={month} setMonth={setMonth} />
        {customersApi.isSuccess &&
          Object.keys(groupedProducts).map((el) => {
            return <DayCard day={el} key={el} classes={groupedProducts[el]} />;
          })}
      </Space>
      {modal && <AddClassModal isOpen={modal} closeModal={onSuccess} />}
      <CreateBundleModal
        isOpen={bundleModal}
        products={products.data}
        closeModal={() => setBundleModal(false)}
      />
    </Spin>
  );
};
