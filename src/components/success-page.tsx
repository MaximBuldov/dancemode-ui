import React from 'react';
import { Result } from 'antd';

export const SuccessPage = () => {
  return (
    <Result
      status="success"
      title="Successfully Purchased!"
      subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    />
  );
};