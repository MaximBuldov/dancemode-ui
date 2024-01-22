import React from 'react';
import { Result } from 'antd';
import { IROrder } from 'models';

interface SuccessPageProps {
  order: IROrder
}

export const SuccessPage = ({ order }: SuccessPageProps) => {
  return (
    <Result
      status="success"
      title="Successfully Purchased!"
      subTitle={`Order number: ${order.id}. Sum: $${order.total}`}
    />
  );
};