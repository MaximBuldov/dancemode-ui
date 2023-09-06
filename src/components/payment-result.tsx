import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentResultProps {
  order: number
}

export const PaymentResult = ({ order }: PaymentResultProps) => {
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      title="Classes Successfully Purchased!"
      subTitle={`Order number: ${order}`}
      extra={[
        <Button key="home" type="primary" onClick={() => navigate('/classes')} block>
          Go to Classes
        </Button>
      ]}
    />
  );
};