import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import dayjs from 'dayjs';

interface MonthStepperProps {
  month: dayjs.Dayjs;
  setMonth: (n: dayjs.Dayjs) => void;
}

export const MonthStepper = ({ month, setMonth }: MonthStepperProps) => {
  return (
    <Space.Compact block>
      <Button
        type="primary"
        block
        onClick={() => setMonth(month.subtract(1, 'M'))}
      >
        <ArrowLeftOutlined /> {month.subtract(1, 'M').format('MMMM')}
      </Button>
      <Button type="primary" ghost block>
        {month.format('MMMM')}
      </Button>
      <Button type="primary" block onClick={() => setMonth(month.add(1, 'M'))}>
        {month.add(1, 'M').format('MMMM')} <ArrowRightOutlined />
      </Button>
    </Space.Compact>
  );
};
