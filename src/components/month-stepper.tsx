import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface MonthStepperProps {
  month: number;
  setMonth: (n: number) => void
}

export const MonthStepper = ({ month, setMonth }: MonthStepperProps) => {
  return (
    <Space.Compact block>
      <Button
        type="primary"
        block
        onClick={() => setMonth(month - 1)}
      >
        <ArrowLeftOutlined /> {renderMonth(month - 1)}
      </Button>
      <Button
        type="primary"
        ghost
        block
      >
        {renderMonth(month)}
      </Button>
      <Button
        type="primary"
        block
        onClick={() => setMonth(month + 1)}
      >
        {renderMonth(month + 1)} <ArrowRightOutlined />
      </Button>
    </Space.Compact>
  );

  function renderMonth(n: number) {
    return dayjs().month(n).format('MMMM');
  }
};