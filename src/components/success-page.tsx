import React from 'react';
import { Result } from 'antd';
import { IROrder } from 'models';

interface SuccessPageProps {
  order: IROrder
}

export const SuccessPage = ({ order }: SuccessPageProps) => {
  console.log(order);
  return (
    <Result
      status="success"
      title="Successfully Purchased!"
      subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    />
  );
};